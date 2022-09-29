import { randomHex } from "~/utils";
import { Readable } from "stream";
import { HorizontalEvent, Subscriber } from "~/event";
import * as db from "~/db";
import * as entity from "~/entity/horizontal";
import { identity } from "./identity";
import { HorizontalImpl } from "~/impl/horizontal";
import dbConfig from "~/db/config";

class Horizontal implements HorizontalImpl {
  private subscriber = new Subscriber<HorizontalEvent>();

  async init(cfg = dbConfig): Promise<void> {
    await db.init(cfg);
  }

  async createTask(
    address: string,
    dataset: string,
    commitment: string,
    taskType: string
  ): Promise<[string, string]> {
    const em = db.getEntityManager();
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = new entity.Task(address, dataset, commitment, taskType);
    await em.persistAndFlush(task);
    this.subscriber.publish({
      type: "TaskCreated",
      address: task.address,
      taskID: task.outID,
      dataset: task.dataset,
      url: node.url,
      commitment: task.commitment,
      taskType: taskType,
    });
    return [randomHex(32), task.outID];
  }

  async finishTask(address: string, taskID: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = await em.findOne(entity.Task, { outID: taskID });

    if (!task) {
      throw new Error(`task ${taskID} doesn't exist`);
    }
    task.finished = true;
    await em.flush();
    this.subscriber.publish({
      type: "TaskFinished",
      taskID: taskID,
    });
    return randomHex(32);
  }

  async getTask(taskID: string): Promise<entity.TaskInfo> {
    const em = db.getEntityManager();
    const task = await em.findOne(entity.Task, { outID: taskID });
    if (!task) {
      throw new Error(`task ${taskID} doesn't exist`);
    }

    const node = await identity.getNodeInfo(task.address);
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
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = await em.findOne(entity.Task, { outID: taskID });
    if (!task) {
      throw new Error(`task of id ${taskID} doesn't exist`);
    }

    const roundEntity = new entity.Round(task, round, entity.RoundStatus.Started);
    await em.persistAndFlush(roundEntity);
    this.subscriber.publish({
      type: "RoundStarted",
      taskID: taskID,
      round: round,
    });
    return randomHex(32);
  }

  async joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== entity.RoundStatus.Started) {
      throw new Error(`task ${taskID} round ${round} status is not Started`);
    }

    const member = new entity.RoundMember(roundEntity, address, entity.RoundStatus.Started);
    const key1 = new entity.Key(member, pk1, entity.KeyType.PK1);
    const key2 = new entity.Key(member, pk2, entity.KeyType.PK2);
    member.keys.add(key1);
    member.keys.add(key2);
    await em.persistAndFlush(member);
    return randomHex(32);
  }

  async getTaskRound(taskID: string, round: number): Promise<entity.TaskRoundInfo> {
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
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const roundEntity = await em.findOne(entity.Round, { task: { outID: taskID }, round: round }, [
      "members",
    ]);
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== entity.RoundStatus.Started) {
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
        member.status = entity.RoundStatus.Running;
      }
    }
    roundEntity.status = entity.RoundStatus.Running;
    await em.flush();

    this.subscriber.publish({
      type: "PartnerSelected",
      taskID: taskID,
      round: round,
      addrs: clients,
    });
    return randomHex(32);
  }

  private async uploadShareCommitment(
    address: string,
    taskID: string,
    round: number,
    receivers: string[],
    commitments: string[],
    type: entity.ShareType
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
      status: entity.RoundStatus.Running,
    });
    if (!src) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    const dsts = await em.find(entity.RoundMember, {
      round: roundEntity,
      address: { $in: receivers },
      status: entity.RoundStatus.Running,
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
    return await this.uploadShareCommitment(
      address,
      taskID,
      round,
      receivers,
      commitments,
      entity.ShareType.Seed
    );
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
      entity.ShareType.SecretKey
    );
  }

  async getClientPublicKeys(taskID: string, round: number, clients: string[]): Promise<[string, string][]> {
    const em = db.getEntityManager();

    const members = await em.find(entity.RoundMember, {
      round: { task: { outID: taskID }, round: round },
      address: { $in: clients },
    });
    if (members.length !== clients.length) {
      throw new Error(`task ${taskID} round ${round} some member in clients doesn't exist`);
    }
    for (const member of members) {
      if (member.status < entity.RoundStatus.Running) {
        throw new Error(`member ${member.address} hasn't join this round`);
      }
    }

    const pk1s = await em.find(entity.Key, {
      member: { $in: members },
      type: entity.KeyType.PK1,
    });
    if (pk1s.length !== members.length) {
      throw new Error(`task ${taskID} round ${round} some member doesn't upload pk1`);
    }
    const pk2s = await em.find(entity.Key, {
      member: { $in: members },
      type: entity.KeyType.PK2,
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
    if (roundEntity.status !== entity.RoundStatus.Running) {
      throw new Error(`round ${round} status is not in running status`);
    }

    const members = await em.find(entity.RoundMember, {
      round: roundEntity,
      status: entity.RoundStatus.Running,
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
        member.status = entity.RoundStatus.Calculating;
      }
    }
    roundEntity.status = entity.RoundStatus.Calculating;
    await em.flush();

    this.subscriber.publish({
      type: "CalculationStarted",
      taskID: taskID,
      round: round,
      addrs: clients,
    });
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
    if (roundEntity.status !== entity.RoundStatus.Calculating) {
      throw new Error(`task ${taskID} round ${round} is not in calculating status`);
    }

    const member = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
    });
    if (!member) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }
    if (member.status !== entity.RoundStatus.Calculating) {
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
    if (roundEntity.status !== entity.RoundStatus.Calculating) {
      throw new Error(`round ${round} status is not in calculating status`);
    }

    const members = await em.find(entity.RoundMember, {
      round: roundEntity,
      status: entity.RoundStatus.Calculating,
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
        member.status = entity.RoundStatus.Aggregating;
      }
    }
    roundEntity.status = entity.RoundStatus.Aggregating;
    await em.flush();

    this.subscriber.publish({
      type: "AggregationStarted",
      taskID: taskID,
      round: round,
      addrs: clients,
    });
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
    if (roundEntity.status !== entity.RoundStatus.Aggregating) {
      throw new Error(`round ${round} status is not in aggregationg status`);
    }

    const srcs = await em.find(entity.RoundMember, {
      round: roundEntity,
      address: { $in: senders },
      status: entity.RoundStatus.Aggregating,
    });
    if (srcs.length != senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders doesn't exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
      status: entity.RoundStatus.Aggregating,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    // check secret key do not exist
    const skCount = await em.count(entity.Share, {
      sender: { $in: srcs },
      receiver: dst,
      type: entity.ShareType.SecretKey,
    });
    if (skCount !== 0) {
      throw new Error(`task ${taskID} round ${round} some senders have upload secret key`);
    }

    const srcMap = new Map(srcs.map((member) => [member.address, member]));
    for (let i = 0; i < senders.length; i++) {
      const src = srcMap.get(senders[i])!;
      const seed = seeds[i];
      const share = new entity.Share(src, dst, seed, entity.ShareType.Seed);
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
    if (roundEntity.status !== entity.RoundStatus.Aggregating) {
      throw new Error(`round ${round} status is not in aggregationg status`);
    }

    const srcs = await em.find(entity.RoundMember, {
      round: roundEntity,
      address: { $in: senders },
      status: entity.RoundStatus.Calculating,
    });
    if (srcs.length != senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders doesn't exist`);
    }

    const dst = await em.findOne(entity.RoundMember, {
      round: roundEntity,
      address: address,
      status: entity.RoundStatus.Aggregating,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    // check seed do not exist
    const seedCount = await em.count(entity.Share, {
      sender: { $in: srcs },
      receiver: dst,
      type: entity.ShareType.Seed,
    });
    if (seedCount !== 0) {
      throw new Error(`task ${taskID} round ${round} some senders have upload seed`);
    }

    const srcMap = new Map(srcs.map((member) => [member.address, member]));
    for (let i = 0; i < senders.length; i++) {
      const src = srcMap.get(senders[i])!;
      const secretKey = secretKeys[i];
      const share = new entity.Share(src, dst, secretKey, entity.ShareType.SecretKey);
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
  ): Promise<entity.SecretShareData[]> {
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
      type: entity.ShareType.Seed,
    });
    if (seedCommitments.length !== senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders do not have seed commitments`);
    }
    const skCommitments = await em.find(entity.ShareCommitment, {
      sender: { $in: srcs },
      receiver: dst,
      type: entity.ShareType.SecretKey,
    });
    if (skCommitments.length !== senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders do not have secret key commitments`);
    }

    const seeds = await em.find(entity.Share, {
      sender: { $in: srcs },
      receiver: dst,
      type: entity.ShareType.Seed,
    });
    const sks = await em.find(entity.Share, {
      sender: { $in: srcs },
      receiver: dst,
      type: entity.ShareType.SecretKey,
    });

    const seedCommitmentMap = new Map(seedCommitments.map((item) => [item.sender.address, item.commitment]));
    const skCommitmentMap = new Map(skCommitments.map((item) => [item.sender.address, item.commitment]));
    const seedMap = new Map(seeds.map((item) => [item.sender.address, item.share]));
    const skMap = new Map(sks.map((item) => [item.sender.address, item.share]));

    const ssDatas: entity.SecretShareData[] = new Array(senders.length);
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
    if (roundEntity.status !== entity.RoundStatus.Aggregating) {
      throw new Error(`round ${round} status is not in aggregationg status`);
    }

    roundEntity.status = entity.RoundStatus.Finished;
    await em.flush();

    this.subscriber.publish({
      type: "RoundEnded",
      taskID: taskID,
      round: round,
    });
    return randomHex(32);
  }

  subscribe(address: string): Readable {
    return this.subscriber.subscribe(address);
  }

  unsubscribe(stream: Readable): void {
    this.subscriber.unsubscribe(stream);
  }
}

export const horizontal = new Horizontal();
