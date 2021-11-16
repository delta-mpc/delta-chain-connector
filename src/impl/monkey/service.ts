import { Writable } from "stream";
import { Event } from "..";
import { Subscriber } from "../event";
import {
  KeyType,
  NodeInfo,
  RoundStatus,
  SecretShareData,
  Service,
  ShareType,
  TaskRoundInfo,
} from "../service";
import * as db from "./db";
import dbConfig from "./db/config";
import * as entity from "./entity";
import { Key, RoundMember } from "./entity";

class _Service implements Service {
  private subscriber = new Subscriber();

  async init(cfg = dbConfig): Promise<void> {
    await db.init(cfg);
  }

  async join(url: string, name: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { url: url });
    if (node) {
      return node.address;
    } else {
      const node = new entity.Node(url, name);
      await em.persistAndFlush(node);
      return node.address;
    }
  }

  async updateUrl(address: string, url: string): Promise<void> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });

    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    node.url = url;
    await em.persistAndFlush(node);
  }

  async updateName(address: string, name: string): Promise<void> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    node.name = name;
    await em.persistAndFlush(node);
  }

  async leave(address: string): Promise<void> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    await em.removeAndFlush(node);
  }

  async getNodeInfo(address: string): Promise<NodeInfo> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    return { url: node.url, name: node.name };
  }

  async createTask(address: string, dataset: string, commitment: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = new entity.Task(address, dataset, commitment);
    await em.persistAndFlush(task);
    const event: Event = {
      type: "TaskCreated",
      address: task.address,
      taskID: task.outID,
      dataset: task.dataset,
      url: node.url,
      commitment: task.commitment,
    };
    this.subscriber.publish(event);
    return task.outID;
  }

  async startRound(address: string, taskID: string, round: number): Promise<void> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = await em.findOne(entity.Task, { outID: taskID });
    if (!task) {
      throw new Error(`task of id ${taskID} doesn't exist`);
    }

    const roundEntity = new entity.Round(task, round, RoundStatus.Started);
    await em.persistAndFlush(roundEntity);
    const event: Event = {
      type: "RoundStarted",
      taskID: taskID,
      round: round,
    };
    this.subscriber.publish(event);
  }

  async joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<void> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== RoundStatus.Started) {
      throw new Error(`task ${taskID} round ${round} status is not Started`);
    }

    const member = new RoundMember(roundEntity, address, RoundStatus.Started);
    const key1 = new Key(member, pk1, KeyType.PK1);
    const key2 = new Key(member, pk2, KeyType.PK2);
    member.keys.add(key1);
    member.keys.add(key2);
    await em.persistAndFlush(member);
  }

  async getTaskRound(taskID: string, round: number): Promise<TaskRoundInfo> {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round }, [
      "members",
    ]);
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    const clients = Array.from(roundEntity.members, (member) => member.address);
    return {
      round: round,
      status: roundEntity.status,
      clients: clients,
    };
  }

  async selectCandidates(address: string, taskID: string, round: number, clients: string[]): Promise<void> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round }, [
      "members",
    ]);
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== RoundStatus.Started) {
      throw new Error(`task ${taskID} round ${round} is not in Started status`);
    }
    // check all clients are valid
    const memberAddrSet = new Set(Array.from(roundEntity.members, (member) => member.address));
    for (const client of clients) {
      if (!memberAddrSet.has(client)) {
        throw new Error(`client ${client} is invalid`);
      }
    }

    const clientSet = new Set(clients);
    for (const member of roundEntity.members) {
      if (clientSet.has(member.address)) {
        member.status = RoundStatus.Running;
      }
    }
    roundEntity.status = RoundStatus.Running;
    await em.flush();

    const event: Event = {
      type: "PartnerSelected",
      taskID: taskID,
      round: round,
      addrs: clients,
    };
    this.subscriber.publish(event);
  }

  private async uploadShareCommitment(
    address: string,
    taskID: string,
    round: number,
    receiver: string,
    commitment: string,
    type: ShareType
  ) {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }

    const src = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
      status: RoundStatus.Running,
    });
    if (!src) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: receiver,
      status: RoundStatus.Running,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${receiver} doesn't exist`);
    }

    const shareCommitment = new entity.ShareCommitment(src, dst, commitment, type);
    await em.persistAndFlush(shareCommitment);
  }

  async uploadSeedCommitment(
    address: string,
    taskID: string,
    round: number,
    receiver: string,
    commitment: string
  ) {
    await this.uploadShareCommitment(address, taskID, round, receiver, commitment, ShareType.Seed);
  }

  async uploadSecretKeyCommitment(
    address: string,
    taskID: string,
    round: number,
    receiver: string,
    commitment: string
  ) {
    await this.uploadShareCommitment(address, taskID, round, receiver, commitment, ShareType.SecretKey);
  }

  async getClientPublickKeys(taskID: string, round: number, client: string): Promise<[string, string]> {
    const em = db.getEntityManager();

    const member = await em.findOne(entity.RoundMember, {
      round: { task: { outID: taskID }, round: round },
      address: client,
    });
    if (!member) {
      throw new Error(`task ${taskID} round ${round} member ${client} doesn't exist`);
    }
    if (member.status < RoundStatus.Running) {
      throw new Error(`member ${client} hasn't join this round`);
    }

    const pks = await em.find(entity.Key, {
      member: member,
    });

    let pk1!: string;
    let pk2!: string;
    for (const pk of pks) {
      if (pk.type == KeyType.PK1) {
        pk1 = pk.key;
      } else {
        pk2 = pk.key;
      }
    }
    return [pk1, pk2];
  }

  async startCalculation(address: string, taskID: string, round: number, clients: string[]) {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID, address: address },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== RoundStatus.Running) {
      throw new Error(`round ${round} status is not in running status`);
    }

    const members = await em.find(entity.RoundMember, {
      round: roundEntity,
      status: RoundStatus.Running,
    });

    // check all clients are valid
    const memberAddrSet = new Set(members.map((member) => member.address));
    for (const client of clients) {
      if (!memberAddrSet.has(client)) {
        throw new Error(`client ${client} is not valid`);
      }
    }

    const clientSet = new Set(clients);
    for (const member of members) {
      if (clientSet.has(member.address)) {
        member.status = RoundStatus.Calculating;
      }
    }
    roundEntity.status = RoundStatus.Calculating;
    await em.flush();

    const event: Event = {
      type: "CalculationStarted",
      taskID: taskID,
      round: round,
      addrs: clients,
    };
    this.subscriber.publish(event);
  }

  async uploadResultCommitment(address: string, taskID: string, round: number, commitment: string) {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== RoundStatus.Calculating) {
      throw new Error(`task ${taskID} round ${round} is not in calculating status`);
    }

    const member = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
    });
    if (!member) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }
    if (member.status !== RoundStatus.Calculating) {
      throw new Error(`task ${taskID} round ${round} member ${address} is not in calculating status`);
    }

    const resultCommitment = new entity.ResultCommitment(member, commitment);
    await em.persistAndFlush(resultCommitment);
  }

  async getResultCommitment(taskID: string, round: number, client: string): Promise<string> {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }

    const member = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: client,
    });
    if (!member) {
      throw new Error(`task ${taskID} round ${round} member ${client} doesn't exist`);
    }

    const resultCommitment = await em.findOne(entity.ResultCommitment, {
      member: member,
    });
    if (!resultCommitment) {
      throw new Error(`task ${taskID} round ${round} member ${client} hasn't upload result commitment`);
    }

    return resultCommitment.commitment;
  }

  async startAggregation(address: string, taskID: string, round: number, clients: string[]) {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID, address: address },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== RoundStatus.Calculating) {
      throw new Error(`round ${round} status is not in calculating status`);
    }

    const members = await em.find(entity.RoundMember, {
      round: roundEntity,
      status: RoundStatus.Calculating,
    });

    // check all clients are valid
    const memberAddrSet = new Set(members.map((member) => member.address));
    for (const client of clients) {
      if (!memberAddrSet.has(client)) {
        throw new Error(`client ${client} is not valid`);
      }
    }

    const clientSet = new Set(clients);
    for (const member of members) {
      if (clientSet.has(member.address)) {
        member.status = RoundStatus.Aggregating;
      }
    }
    roundEntity.status = RoundStatus.Aggregating;
    await em.flush();

    const event: Event = {
      type: "AggregationStarted",
      taskID: taskID,
      round: round,
      addrs: clients,
    };
    this.subscriber.publish(event);
  }

  async uploadSeed(address: string, taskID: string, round: number, sender: string, seed: string) {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== RoundStatus.Aggregating) {
      throw new Error(`round ${round} status is not in aggregationg status`);
    }

    const src = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: sender,
      status: RoundStatus.Aggregating,
    });
    if (!src) {
      throw new Error(`task ${taskID} round ${round} member ${sender} doesn't exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
      status: RoundStatus.Aggregating,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    const share = new entity.Share(src, dst, seed, ShareType.Seed);
    await em.persistAndFlush(share);
  }

  async uploadSecretKey(address: string, taskID: string, round: number, sender: string, secretKey: string) {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== RoundStatus.Aggregating) {
      throw new Error(`round ${round} status is not in aggregationg status`);
    }

    const src = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: sender,
      status: RoundStatus.Calculating,
    });
    if (!src) {
      throw new Error(`task ${taskID} round ${round} member ${sender} doesn't exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
      status: RoundStatus.Aggregating,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }
    dst.status = RoundStatus.Finished;
    const share = new entity.Share(src, dst, secretKey, ShareType.SecretKey);
    em.persist(share);
    await em.flush();
  }

  async getSecretShareData(
    taskID: string,
    round: number,
    sender: string,
    receiver: string
  ): Promise<SecretShareData> {
    const em = db.getEntityManager();
    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }

    const src = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: sender,
    });
    if (!src) {
      throw new Error(`task ${taskID} round ${round} member ${sender} doesn't exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: receiver,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${receiver} doesn't exist`);
    }

    const shares = await em.find(entity.Share, {
      sender: src,
      receiver: dst,
    });
    if (shares.length !== 1) {
      throw new Error(
        `task ${taskID} round ${round} sender ${sender} receiver ${receiver} has multiple shares`
      );
    }
    const share = shares[0];
    const type = share.type;

    const shareCommitment = await em.findOne(entity.ShareCommitment, {
      sender: src,
      receiver: dst,
      type: type,
    });
    if (!shareCommitment) {
      throw new Error(
        `task ${taskID} round ${round} sender ${sender} receiver ${receiver} type ${type} commitment doesn't exist`
      );
    }

    return {
      seed: type === ShareType.Seed ? share.share : undefined,
      seedCommitment: type === ShareType.Seed ? shareCommitment.commitment : undefined,
      secretKey: type === ShareType.SecretKey ? share.share : undefined,
      secretKeyCommitment: type === ShareType.SecretKey ? shareCommitment.commitment : undefined,
    };
  }

  async endRound(address: string, taskID: string, round: number) {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID, address: address },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== RoundStatus.Aggregating) {
      throw new Error(`round ${round} status is not in aggregationg status`);
    }

    roundEntity.status = RoundStatus.Finished;
    await em.flush();

    const event: Event = {
      type: "RoundEnded",
      taskID: taskID,
      round: round,
    };
    this.subscriber.publish(event);
  }

  subscribe(dst: Writable) {
    this.subscriber.subscribe(dst);
  }

  unsubscribe(dst: Writable) {
    this.subscriber.unsubscribe(dst);
  }
}

export const service = new _Service();
