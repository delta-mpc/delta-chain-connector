import { Options } from "@mikro-orm/core";
import * as crypto from "crypto";
import { Readable } from "stream";
import log from "~/log";
import { Event, Subscriber } from "../event";
import {
  Impl,
  KeyType,
  NodeInfo,
  NodeInfosPage,
  RoundStatus,
  SecretShareData,
  ShareType,
  TaskInfo,
  TaskRoundInfo
} from "../service";
import * as db from "./db";
import dbConfig from "./db/config";
import * as entity from "./entity";
import { Key, RoundMember } from "./entity";

export interface ImplOption extends Options {
  dev?: boolean;
}

function randomHex(length: number): string {
  return "0x" + crypto.randomBytes(length).toString("hex");
}

class _Impl implements Impl {
  private subscriber = new Subscriber();

  async init(cfg: ImplOption = dbConfig): Promise<void> {
    await db.init(cfg);
  }

  async join(url: string, name: string): Promise<[string, string]> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { url: url });
    log.info(`node joined ${node?.joined}`);
    if (!node) {
      const node = new entity.Node(url, name);
      node.joined = true;
      await em.persistAndFlush(node);
      return [randomHex(32), node.address];
    } else if (node.joined == false) {
      // check node.joined explictly. Note: node.joined is a integer in database, so we should use == instead of === to check it.
      node.joined = true;
      await em.flush();
      return [randomHex(32), node.address];
    } else {
      throw new Error(`node ${node.address} has already joined`);
    }
  }

  async updateUrl(address: string, url: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });

    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    node.url = url;
    await em.persistAndFlush(node);
    return randomHex(32);
  }

  async updateName(address: string, name: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    node.name = name;
    await em.persistAndFlush(node);
    return randomHex(32);
  }

  async leave(address: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    node.joined = false;
    await em.flush();
    return randomHex(32);
  }

  async getNodeInfo(address: string): Promise<NodeInfo> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    return { address: address, url: node.url, name: node.name };
  }

  async getNodes(page: number, pageSize: number): Promise<NodeInfosPage> {
    const em = db.getEntityManager();
    const [nodes, totalCount] = await em.findAndCount(
      entity.Node,
      { joined: true },
      { orderBy: { id: "ASC" }, limit: pageSize, offset: (page - 1) * pageSize }
    );
    return {
      nodes: nodes.map((node) => {
        return {
          address: node.address,
          url: node.url,
          name: node.name,
        };
      }),
      totalCount: totalCount,
    };
  }

  async createTask(
    address: string,
    dataset: string,
    commitment: string,
    taskType: string
  ): Promise<[string, string]> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = new entity.Task(address, dataset, commitment, taskType);
    await em.persistAndFlush(task);
    const event: Event = {
      type: "TaskCreated",
      address: task.address,
      taskID: task.outID,
      dataset: task.dataset,
      url: node.url,
      commitment: task.commitment,
      taskType: taskType,
    };
    this.subscriber.publish(event);
    return [randomHex(32), task.outID];
  }

  async finishTask(address: string, taskID: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = await em.findOne(entity.Task, { outID: taskID });

    if (!task) {
      throw new Error(`task ${taskID} doesn't exist`);
    }
    task.finished = true;
    await em.flush();
    const event: Event = {
      type: "TaskFinished",
      taskID: taskID,
    };
    this.subscriber.publish(event);
    return randomHex(32);
  }

  async getTask(taskID: string): Promise<TaskInfo> {
    const em = db.getEntityManager();
    const task = await em.findOne(entity.Task, { outID: taskID });
    if (!task) {
      throw new Error(`task ${taskID} doesn't exist`);
    }

    const node = await em.findOne(entity.Node, { address: task.address });
    if (!node) {
      throw new Error(`node ${task.address} doesn't exist`);
    }

    return {
      address: task.address,
      url: node?.url,
      taskID: taskID,
      dataset: task.dataset,
      commitment: task.commitment,
      taskType: task.taskType,
      finished: task.finished,
    };
  }

  async startRound(address: string, taskID: string, round: number): Promise<string> {
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
    return randomHex(32);
  }

  async joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<string> {
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
    return randomHex(32);
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

  async selectCandidates(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
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
    return randomHex(32);
  }

  private async uploadShareCommitment(
    address: string,
    taskID: string,
    round: number,
    receivers: string[],
    commitments: string[],
    type: ShareType
  ): Promise<string> {
    if (receivers.length !== commitments.length) {
      throw new Error(`task ${taskID} round ${round} receivers' length is not equal to commitments' length`);
    }
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

    const dsts = await em.find(entity.RoundMember, {
      round: roundEntity,
      address: { $in: receivers },
      status: RoundStatus.Running,
    });
    if (dsts.length !== receivers.length) {
      throw new Error(`task ${taskID} round ${round} some receivers doesn't exist`);
    }

    const dstMap = new Map(dsts.map((member) => [member.address, member]));
    for (let i = 0; i < dsts.length; i++) {
      const dst = dstMap.get(receivers[i])!;
      const commitment = commitments[i];
      const shareCommitment = new entity.ShareCommitment(src, dst, commitment, type);
      em.persist(shareCommitment);
    }

    await em.flush();
    return randomHex(32);
  }

  async uploadSeedCommitment(
    address: string,
    taskID: string,
    round: number,
    receivers: string[],
    commitments: string[]
  ): Promise<string> {
    return await this.uploadShareCommitment(address, taskID, round, receivers, commitments, ShareType.Seed);
  }

  async uploadSecretKeyCommitment(
    address: string,
    taskID: string,
    round: number,
    receivers: string[],
    commitments: string[]
  ): Promise<string> {
    return await this.uploadShareCommitment(
      address,
      taskID,
      round,
      receivers,
      commitments,
      ShareType.SecretKey
    );
  }

  async getClientPublickKeys(taskID: string, round: number, clients: string[]): Promise<[string, string][]> {
    const em = db.getEntityManager();

    const members = await em.find(entity.RoundMember, {
      round: { task: { outID: taskID }, round: round },
      address: { $in: clients },
    });
    if (members.length !== clients.length) {
      throw new Error(`task ${taskID} round ${round} some member in clients doesn't exist`);
    }
    for (const member of members) {
      if (member.status < RoundStatus.Running) {
        throw new Error(`member ${member.address} hasn't join this round`);
      }
    }

    const pk1s = await em.find(entity.Key, {
      member: { $in: members },
      type: KeyType.PK1,
    });
    if (pk1s.length !== members.length) {
      throw new Error(`task ${taskID} round ${round} some member doesn't upload pk1`);
    }
    const pk2s = await em.find(entity.Key, {
      member: { $in: members },
      type: KeyType.PK2,
    });
    if (pk2s.length !== members.length) {
      throw new Error(`task ${taskID} round ${round} some member doesn't upload pk2`);
    }

    const pk1Map = new Map(pk1s.map((key) => [key.member.address, key.key]));
    const pk2Map = new Map(pk2s.map((key) => [key.member.address, key.key]));

    const pks: [string, string][] = new Array(clients.length);
    for (const [i, client] of clients.entries()) {
      const pk1 = pk1Map.get(client)!;
      const pk2 = pk2Map.get(client)!;
      pks[i] = [pk1, pk2];
    }
    return pks;
  }

  async startCalculation(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
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
    return randomHex(32);
  }

  async uploadResultCommitment(
    address: string,
    taskID: string,
    round: number,
    commitment: string
  ): Promise<string> {
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
    return randomHex(32);
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

  async startAggregation(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
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
    return randomHex(32);
  }

  async uploadSeed(
    address: string,
    taskID: string,
    round: number,
    senders: string[],
    seeds: string[]
  ): Promise<string> {
    if (senders.length !== seeds.length) {
      throw new Error(`task ${taskID} round ${round} senders' length is not equal to seeds' length`);
    }

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

    const srcs = await em.find(entity.RoundMember, {
      round: roundEntity,
      address: { $in: senders },
      status: RoundStatus.Aggregating,
    });
    if (srcs.length != senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders doesn't exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
      status: RoundStatus.Aggregating,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    // check secret key do not exist
    const skCount = await em.count(entity.Share, {
      sender: { $in: srcs },
      receiver: dst,
      type: ShareType.SecretKey,
    });
    if (skCount !== 0) {
      throw new Error(`task ${taskID} round ${round} some senders have upload secret key`);
    }

    const srcMap = new Map(srcs.map((member) => [member.address, member]));
    for (let i = 0; i < senders.length; i++) {
      const src = srcMap.get(senders[i])!;
      const seed = seeds[i];
      const share = new entity.Share(src, dst, seed, ShareType.Seed);
      em.persist(share);
    }

    await em.flush();
    return randomHex(32);
  }

  async uploadSecretKey(
    address: string,
    taskID: string,
    round: number,
    senders: string[],
    secretKeys: string[]
  ): Promise<string> {
    if (senders.length !== secretKeys.length) {
      throw new Error(`task ${taskID} round ${round} senders' length is not equal to secretKeys' length`);
    }

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

    const srcs = await em.find(entity.RoundMember, {
      round: roundEntity,
      address: { $in: senders },
      status: RoundStatus.Calculating,
    });
    if (srcs.length != senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders doesn't exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
      status: RoundStatus.Aggregating,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    // check seed do not exist
    const seedCount = await em.count(entity.Share, {
      sender: { $in: srcs },
      receiver: dst,
      type: ShareType.Seed,
    });
    if (seedCount !== 0) {
      throw new Error(`task ${taskID} round ${round} some senders have upload seed`);
    }

    const srcMap = new Map(srcs.map((member) => [member.address, member]));
    for (let i = 0; i < senders.length; i++) {
      const src = srcMap.get(senders[i])!;
      const secretKey = secretKeys[i];
      const share = new entity.Share(src, dst, secretKey, ShareType.SecretKey);
      em.persist(share);
    }

    await em.flush();
    return randomHex(32);
  }

  async getSecretShareDatas(
    taskID: string,
    round: number,
    senders: string[],
    receiver: string
  ): Promise<SecretShareData[]> {
    const em = db.getEntityManager();
    const roundEntity = await em.findOne(entity.Round, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }

    const srcs = await em.find(entity.RoundMember, {
      round: roundEntity,
      address: { $in: senders },
    });
    if (srcs.length !== senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders do not exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: receiver,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${receiver} doesn't exist`);
    }

    const seedCommitments = await em.find(entity.ShareCommitment, {
      sender: { $in: srcs },
      receiver: dst,
      type: ShareType.Seed,
    });
    if (seedCommitments.length !== senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders do not have seed commitments`);
    }
    const skCommitments = await em.find(entity.ShareCommitment, {
      sender: { $in: srcs },
      receiver: dst,
      type: ShareType.SecretKey,
    });
    if (skCommitments.length !== senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders do not have secret key commitments`);
    }

    const seeds = await em.find(entity.Share, {
      sender: { $in: srcs },
      receiver: dst,
      type: ShareType.Seed,
    });
    const sks = await em.find(entity.Share, {
      sender: { $in: srcs },
      receiver: dst,
      type: ShareType.SecretKey,
    });

    const seedCommitmentMap = new Map(seedCommitments.map((item) => [item.sender.address, item.commitment]));
    const skCommitmentMap = new Map(skCommitments.map((item) => [item.sender.address, item.commitment]));
    const seedMap = new Map(seeds.map((item) => [item.sender.address, item.share]));
    const skMap = new Map(sks.map((item) => [item.sender.address, item.share]));

    const ssDatas: SecretShareData[] = new Array(senders.length);
    for (const [i, sender] of senders.entries()) {
      ssDatas[i] = {
        seed: seedMap.get(sender),
        seedCommitment: seedCommitmentMap.get(sender),
        secretKey: skMap.get(sender),
        secretKeyCommitment: skCommitmentMap.get(sender),
      };
    }

    return ssDatas;
  }

  async endRound(address: string, taskID: string, round: number): Promise<string> {
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
    return randomHex(32);
  }

  subscribe(timeout: number): Readable {
    return this.subscriber.subscribe(timeout);
  }

  unsubscribe(stream: Readable) {
    this.subscriber.unsubscribe(stream);
  }
}

export const impl = new _Impl();
