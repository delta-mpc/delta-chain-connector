import BN from "bn.js";
import { Readable } from "stream";
import * as db from "~/db";
import dbConfig from "~/db/config";
import * as entity from "~/entity/hlr";
import { HLREvent, Subscriber } from "~/event";
import { HLRImpl } from "~/impl/hlr";
import { randomHex } from "~/utils";
import * as verifier from "~/verifier";
import { datahub } from "./datahub";
import { identity } from "./identity";

class HLR implements HLRImpl {
  private subscriber = new Subscriber<HLREvent>();

  async init(cfg = dbConfig): Promise<void> {
    await db.init(cfg);
  }

  async createTask(
    address: string,
    dataset: string,
    commitment: string,
    enableVerify: boolean,
    tolerance: number
  ): Promise<[string, string]> {
    const em = db.getEntityManager();
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = new entity.HLRTask(address, dataset, commitment, enableVerify, tolerance);
    em.persist(task);
    if (enableVerify) {
      const verifier = new entity.HLRVerifier(task);
      em.persist(verifier);
    }
    await em.flush();
    this.subscriber.publish({
      type: "HLRTaskCreated",
      address: task.address,
      taskID: task.outID,
      dataset: task.dataset,
      url: node.url,
      commitment: task.commitment,
      taskType: "hlr",
      enableVerify: enableVerify,
      tolerance: tolerance,
    });
    return [randomHex(32), task.outID];
  }

  async finishTask(address: string, taskID: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = await em.findOne(entity.HLRTask, { outID: taskID });

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
    const task = await em.findOne(entity.HLRTask, { outID: taskID });
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
      taskType: "hlr",
      finished: task.finished,
      enableVerify: task.enableVerify,
      tolerance: task.tolerance,
    };
  }

  async startRound(
    address: string,
    taskID: string,
    round: number,
    weightCommitment: string
  ): Promise<string> {
    const em = db.getEntityManager();
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const task = await em.findOne(entity.HLRTask, { outID: taskID });
    if (!task) {
      throw new Error(`task of id ${taskID} doesn't exist`);
    }

    const roundEntity = new entity.HLRRound(task, round, weightCommitment, entity.RoundStatus.Started);
    await em.persistAndFlush(roundEntity);
    this.subscriber.publish({
      type: "RoundStarted",
      taskID: taskID,
      round: round,
    });
    return randomHex(32);
  }

  async getWeightCommitment(taskID: string, round: number): Promise<string> {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    return roundEntity.weightCommitment;
  }

  async joinRound(address: string, taskID: string, round: number, pk1: string, pk2: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== entity.RoundStatus.Started) {
      throw new Error(`task ${taskID} round ${round} status is not Started`);
    }

    const member = new entity.HLRRoundMember(roundEntity, address, entity.RoundStatus.Started);
    const key1 = new entity.HLRKey(member, pk1, entity.KeyType.PK1);
    const key2 = new entity.HLRKey(member, pk2, entity.KeyType.PK2);
    member.keys.add(key1);
    member.keys.add(key2);
    await em.persistAndFlush(member);
    return randomHex(32);
  }

  async getTaskRound(taskID: string, round: number): Promise<entity.TaskRoundInfo> {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round }, [
      "members",
    ]);
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    const joinedClients = Array.from(roundEntity.members, (member) => member.address);
    const finishedClients = Array.from(roundEntity.members)
      .filter((member) => member.status == entity.RoundStatus.Aggregating)
      .map((member) => member.address);
    return {
      round: round,
      status: roundEntity.status,
      joinedClients: joinedClients,
      finishedClients: finishedClients,
    };
  }

  async selectCandidates(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
    const em = db.getEntityManager();
    const node = await identity.getNodeInfo(address);
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }

    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round }, [
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

    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }

    const src = await em.findOne(entity.HLRRoundMember, {
      round: roundEntity,
      address: address,
      status: entity.RoundStatus.Running,
    });
    if (!src) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    const dsts = await em.find(entity.HLRRoundMember, {
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
      const shareCommitment = new entity.HLRShareCommitment(src, dst, commitment, type);
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

    const members = await em.find(entity.HLRRoundMember, {
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

    const pk1s = await em.find(entity.HLRKey, {
      member: { $in: members },
      type: entity.KeyType.PK1,
    });
    if (pk1s.length !== members.length) {
      throw new Error(`task ${taskID} round ${round} some member doesn't upload pk1`);
    }
    const pk2s = await em.find(entity.HLRKey, {
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

    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID, address: address },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== entity.RoundStatus.Running) {
      throw new Error(`round ${round} status is not in running status`);
    }

    const members = await em.find(entity.HLRRoundMember, {
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

    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== entity.RoundStatus.Calculating) {
      throw new Error(`task ${taskID} round ${round} is not in calculating status`);
    }

    const member = await em.findOne(entity.HLRRoundMember, {
      round: roundEntity,
      address: address,
    });
    if (!member) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }
    if (member.status !== entity.RoundStatus.Calculating) {
      throw new Error(`task ${taskID} round ${round} member ${address} is not in calculating status`);
    }

    const resultCommitment = new entity.HLRResultCommitment(member, commitment);
    await em.persistAndFlush(resultCommitment);
    return randomHex(32);
  }

  async getResultCommitment(taskID: string, round: number, client: string): Promise<string> {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }

    const member = await em.findOne(entity.HLRRoundMember, {
      round: roundEntity,
      address: client,
    });
    if (!member) {
      throw new Error(`task ${taskID} round ${round} member ${client} doesn't exist`);
    }

    const resultCommitment = await em.findOne(entity.HLRResultCommitment, {
      member: member,
    });
    if (!resultCommitment) {
      throw new Error(`task ${taskID} round ${round} member ${client} hasn't upload result commitment`);
    }

    return resultCommitment.commitment;
  }

  async startAggregation(address: string, taskID: string, round: number, clients: string[]): Promise<string> {
    const em = db.getEntityManager();

    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID, address: address },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== entity.RoundStatus.Calculating) {
      throw new Error(`round ${round} status is not in calculating status`);
    }

    const members = await em.find(entity.HLRRoundMember, {
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

    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== entity.RoundStatus.Aggregating) {
      throw new Error(`round ${round} status is not in aggregationg status`);
    }

    const srcs = await em.find(entity.HLRRoundMember, {
      round: roundEntity,
      address: { $in: senders },
      status: entity.RoundStatus.Aggregating,
    });
    if (srcs.length != senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders doesn't exist`);
    }

    const dst = await em.findOne(entity.HLRRoundMember, {
      round: roundEntity,
      address: address,
      status: entity.RoundStatus.Aggregating,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    // check secret key do not exist
    const skCount = await em.count(entity.HLRShare, {
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
      const share = new entity.HLRShare(src, dst, seed, entity.ShareType.Seed);
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

    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }
    if (roundEntity.status !== entity.RoundStatus.Aggregating) {
      throw new Error(`round ${round} status is not in aggregationg status`);
    }

    const srcs = await em.find(entity.HLRRoundMember, {
      round: roundEntity,
      address: { $in: senders },
      status: entity.RoundStatus.Calculating,
    });
    if (srcs.length != senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders doesn't exist`);
    }

    const dst = await em.findOne(entity.HLRRoundMember, {
      round: roundEntity,
      address: address,
      status: entity.RoundStatus.Aggregating,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${address} doesn't exist`);
    }

    // check seed do not exist
    const seedCount = await em.count(entity.HLRShare, {
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
      const share = new entity.HLRShare(src, dst, secretKey, entity.ShareType.SecretKey);
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
    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID },
      round: round,
    });
    if (!roundEntity) {
      throw new Error(`task ${taskID} round ${round} doesn't exist`);
    }

    const srcs = await em.find(entity.HLRRoundMember, {
      round: roundEntity,
      address: { $in: senders },
    });
    if (srcs.length !== senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders do not exist`);
    }

    const dst = await em.findOne(entity.HLRRoundMember, {
      round: roundEntity,
      address: receiver,
    });
    if (!dst) {
      throw new Error(`task ${taskID} round ${round} member ${receiver} doesn't exist`);
    }

    const seedCommitments = await em.find(entity.HLRShareCommitment, {
      sender: { $in: srcs },
      receiver: dst,
      type: entity.ShareType.Seed,
    });
    if (seedCommitments.length !== senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders do not have seed commitments`);
    }
    const skCommitments = await em.find(entity.HLRShareCommitment, {
      sender: { $in: srcs },
      receiver: dst,
      type: entity.ShareType.SecretKey,
    });
    if (skCommitments.length !== senders.length) {
      throw new Error(`task ${taskID} round ${round} some senders do not have secret key commitments`);
    }

    const seeds = await em.find(entity.HLRShare, {
      sender: { $in: srcs },
      receiver: dst,
      type: entity.ShareType.Seed,
    });
    const sks = await em.find(entity.HLRShare, {
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

    const roundEntity = await em.findOne(entity.HLRRound, {
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

  async verify(
    address: string,
    taskID: string,
    weightSize: number,
    proof: string,
    pubSignals: string[],
    blockIndex: number,
    samples: number
  ): Promise<[string, boolean]> {
    const txHash = randomHex(32);

    const em = db.getEntityManager();
    const task = await em.findOne(entity.HLRTask, { outID: taskID });
    if (!task) {
      throw new Error(`task ${taskID} doesn't exist`);
    }
    if (!task.finished) {
      throw new Error(`task ${taskID} is not finished`);
    }

    const finalRound = await em.findOne(entity.HLRRound, { task: task }, { orderBy: { round: "DESC" } });
    if (!finalRound) {
      throw new Error(`task ${taskID} final round doesn't exist`);
    }
    if (finalRound.status != entity.RoundStatus.Finished) {
      throw new Error(`task ${taskID} final round is not finished`);
    }

    const finalMembers = await em.find(entity.HLRRoundMember, {
      round: finalRound,
      status: entity.RoundStatus.Aggregating,
    });
    const addresses = finalMembers.map((e) => e.address);

    if (!addresses.includes(address)) {
      throw new Error(`${address} is not allowed to verify`);
    }

    const state = await em.findOne(entity.HLRVerifier, { task: task });
    if (!state) {
      throw new Error(`task ${taskID} verification is forbidden`);
    } else if (!state.valid) {
      throw new Error(`task ${taskID} verfication is already failed`);
    }

    const member = finalMembers.filter((e) => e.address === address)[0];
    let memberState = await em.findOne(entity.HLRMemberVerifier, { member: member });
    if (memberState) {
      throw new Error(`${address} has already verified`);
    }
    const gradients = new Array(0);
    let precision = 0;
    for (const [i, v] of pubSignals.slice(0, -2).entries()) {
      if (i % 2 == 0) {
        gradients.push(v);
      } else {
        const p = Number(v);
        if (precision == 0) {
          precision = p;
          if (precision < task.tolerance) {
            throw new Error(`${taskID} gradient precision is lower than tolerance`);
          } else if (precision !== p) {
            throw new Error(`${taskID} gradient precision is not consistent`);
          }
        }
      }
    }
    // store samples, gradients, precision
    memberState = new entity.HLRMemberVerifier(state, member, samples, gradients, precision);
    em.persist(memberState);
    await em.flush();

    // check zk proof
    const vk = await verifier.getVk(weightSize);
    const valid = await verifier.verify(vk, proof, pubSignals);
    if (!valid) {
      memberState.valid = false;
      state.valid = false;
      await em.flush();
      this.subscriber.publish({
        type: "TaskMemberVerified",
        taskID: taskID,
        address: address,
        verified: false,
      });
      return [txHash, false];
    }

    // check gradients when all members verify
    const q = verifier.getQ(vk.curve);
    const memberVerifiers = await em.find(entity.HLRMemberVerifier, {verifier: state, valid: true});
    if (memberVerifiers.length === finalMembers.length) {
      let precision = 0;
      let samples = 0;
      const finalGradients: BN[] = new Array(gradients.length).fill(new BN(0, 10));
      for (const mv of memberVerifiers) {
        if (precision === 0) {
          precision = mv.precision;
        } else if (precision !== mv.precision) {
          throw new Error(`${taskID} gradient precision is not consistent`);
        }
        samples += mv.samples;
        for (const [i, g] of mv.gradients.entries()) {
          finalGradients[i] = finalGradients[i].add(new BN(g, 10)).mod(q);
        }
      }

      const absGradients = finalGradients.map((g) => {
        return BN.min(g, q.sub(g));
      });
      let norm = q;
      for (const g of absGradients) {
        if (g.lt(norm)) {
          norm = g;
        }
      }
      const threshold = new BN(10, 10).pow(new BN(precision - task.tolerance, 10)).muln(samples);
      if (norm.gte(threshold)) {
        memberState.valid = false;
        state.valid = false;
        await em.flush();
        this.subscriber.publish({
          type: "TaskMemberVerified",
          taskID: taskID,
          address: address,
          verified: false,
        });
        return [txHash, false];
      }
    }

    // check weight commitment
    const weightCommitment = "0x" + new BN(pubSignals[pubSignals.length - 2], 10).toString("hex", 64);
    if (weightCommitment !== finalRound.weightCommitment) {
      memberState.valid = false;
      state.valid = false;
      await em.flush();
      this.subscriber.publish({
        type: "TaskMemberVerified",
        taskID: taskID,
        address: address,
        verified: false,
      });
      return [txHash, false];
    }

    // check data commitment
    const _dataCommitment = "0x" + new BN(pubSignals[pubSignals.length - 1], 10).toString("hex", 64);
    const dataCommitment = await datahub.getDataCommitment(address, task.dataset, blockIndex);
    if (_dataCommitment !== dataCommitment) {
      memberState.valid = false;
      state.valid = false;
      await em.flush();
      this.subscriber.publish({
        type: "TaskMemberVerified",
        taskID: taskID,
        address: address,
        verified: false,
      });
      return [txHash, false];
    }

    await em.flush();
    this.subscriber.publish({
      type: "TaskMemberVerified",
      taskID: taskID,
      address: address,
      verified: true,
    });

    return [txHash, true];
  }

  async getVerifierState(taskID: string): Promise<entity.VerifierState> {
    const em = db.getEntityManager();
    const task = await em.findOne(entity.HLRTask, { outID: taskID });
    if (!task) {
      throw new Error(`task ${taskID} doesn't exist`);
    }
    if (!task.finished) {
      throw new Error(`task ${taskID} is not finished`);
    }

    const finalRound = await em.findOne(entity.HLRRound, { task: task }, { orderBy: { round: "DESC" } });
    if (!finalRound) {
      throw new Error(`task ${taskID} final round doesn't exist`);
    }
    if (finalRound.status != entity.RoundStatus.Finished) {
      throw new Error(`task ${taskID} final round is not finished`);
    }

    const finalMembers = await em.find(entity.HLRRoundMember, {
      round: finalRound,
      status: entity.RoundStatus.Aggregating,
    });
    const addresses = finalMembers.map((e) => e.address);

    const state = await em.findOne(entity.HLRVerifier, { task: task });
    if (!state) {
      return {
        unfinishedClients: addresses,
        invalidClients: [],
        valid: true,
        confirmed: false,
      };
    }

    const finishedMembers = await em.find(entity.HLRMemberVerifier, { member: { $in: finalMembers } });
    const finishedAddresses = finishedMembers.map((e) => e.member.address);
    const unfinishedClients = addresses.filter((e) => !finishedAddresses.includes(e));
    const invalidClients = finishedMembers.filter((e) => !e.valid).map((e) => e.member.address);

    return {
      unfinishedClients: unfinishedClients,
      invalidClients: invalidClients,
      valid: state.valid,
      confirmed: state.confirmed,
    };
  }

  async confirmVerification(address: string, taskID: string): Promise<string> {
    const em = db.getEntityManager();
    const task = await em.findOne(entity.HLRTask, { outID: taskID, address: address });
    if (!task) {
      throw new Error(`task ${taskID} doesn't exist`);
    }
    if (!task.finished) {
      throw new Error(`task ${taskID} is not finished`);
    }
    const state = await em.findOne(entity.HLRVerifier, { task: task });
    if (!state) {
      throw new Error(`task ${taskID} verification is not finished`);
    }
    if (!state.valid) {
      throw new Error(`task ${taskID} verification is already failed`);
    }
    if (state.confirmed) {
      throw new Error(`task ${taskID} verification has already been confirmed`);
    }
    const finalRound = await em.findOne(entity.HLRRound, { task: task }, { orderBy: { round: "DESC" } });
    if (!finalRound) {
      throw new Error(`task ${taskID} final round doesn't exist`);
    }
    if (finalRound.status != entity.RoundStatus.Finished) {
      throw new Error(`task ${taskID} final round is not finished`);
    }
    const finalMembers = await em.find(entity.HLRRoundMember, {
      round: finalRound,
      status: entity.RoundStatus.Aggregating,
    });
    const finishedCount = await em.count(entity.HLRMemberVerifier, { verifier: state, valid: true });
    if (finishedCount !== finalMembers.length) {
      throw new Error(`task ${taskID} verification is not finished`);
    }

    state.confirmed = true;
    await em.flush();

    this.subscriber.publish({
      type: "TaskVerificationConfirmed",
      taskID: taskID,
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

export const hlr = new HLR();
