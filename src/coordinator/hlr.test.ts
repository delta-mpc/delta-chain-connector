import { Options } from "@mikro-orm/core";
import * as chai from "chai";
import chaiAsPromised from "chai-as-promised";
import * as crypto from "crypto";
import * as db from "~/db";
import { datahub } from "./datahub";
import { hlr } from "./hlr";
import { identity } from "./identity";
import * as entity from "~/entity/hlr";

chai.use(chaiAsPromised);

const assert = chai.assert;

function randomBytesString(length: number): string {
  return "0x" + crypto.randomBytes(length).toString("hex");
}

describe("hlr coordinator", function () {
  let address1: string;
  let address2: string;
  let address3: string;
  let address4: string;

  before(async function () {
    const dbConfig: Options = {
      type: "sqlite",
      dbName: ":memory:",
      entities: ["dist/entity/**/*.js"],
      entitiesTs: ["src/entity/**/*.ts"],
    };
    await hlr.init(dbConfig);

    address1 = (await identity.join("127.0.0.1:6700", "1"))[1];
    address2 = (await identity.join("127.0.0.1:6800", "2"))[1];
    address3 = (await identity.join("127.0.0.1:6900", "3"))[1];
    address4 = (await identity.join("127.0.0.1:7000", "4"))[1];
  });

  after(async function () {
    await identity.leave(address1);
    await identity.leave(address2);
    await identity.leave(address3);
    await identity.leave(address4);

    const orm = db.getORM();
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await db.close();
  });

  let taskID: string;
  const dataset = "mnist";
  const taskCommitment = randomBytesString(32);
  const enableVerify = true;
  const tolerance = 6;
  it("node1 create task1", async function () {
    taskID = (await hlr.createTask(address1, dataset, taskCommitment, enableVerify, tolerance))[1];

    assert.lengthOf(taskID, 66);
    assert.strictEqual(taskID.slice(0, 2), "0x");

    const em = db.getEntityManager();
    const task = await em.findOne(entity.HLRTask, { outID: taskID });

    assert.strictEqual(task?.outID, taskID);
    assert.strictEqual(task?.dataset, dataset);
    assert.strictEqual(task?.commitment, taskCommitment);
    assert.strictEqual(task?.enableVerify, enableVerify);
    assert.strictEqual(task?.tolerance, tolerance);
  });

  const round = 1;
  const weightCommitment = randomBytesString(32);
  it("node1 start round1 of task1", async function () {
    await hlr.startRound(address1, taskID, round, weightCommitment);

    const em = db.getEntityManager();
    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round });

    assert.strictEqual(roundEntity?.status, entity.RoundStatus.Started);
    assert.strictEqual(roundEntity?.weightCommitment, weightCommitment);
    assert.strictEqual(roundEntity?.round, round);
  });

  it("get round weightCommitment", async function () {
    const _weightCommitment = await hlr.getWeightCommitment(taskID, round);
    assert.strictEqual(_weightCommitment, weightCommitment);
  });

  const pk11 = randomBytesString(32);
  const pk12 = randomBytesString(32);
  const pk21 = randomBytesString(32);
  const pk22 = randomBytesString(32);
  const pk31 = randomBytesString(32);
  const pk32 = randomBytesString(32);
  it("node1,2,3 join round1", async function () {
    await hlr.joinRound(address1, taskID, round, pk11, pk12);
    await hlr.joinRound(address2, taskID, round, pk21, pk22);
    await hlr.joinRound(address3, taskID, round, pk31, pk32);

    const em = db.getEntityManager();
    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round });
    const member2 = await em.findOne(entity.HLRRoundMember, { round: roundEntity, address: address2 });

    assert.strictEqual(member2?.address, address2);
    assert.strictEqual(member2?.status, entity.RoundStatus.Started);

    const pk21Entity = await em.findOne(entity.HLRKey, { member: member2, type: entity.KeyType.PK1 });
    const pk22Entity = await em.findOne(entity.HLRKey, { member: member2, type: entity.KeyType.PK2 });

    assert.strictEqual(pk21Entity?.key, pk21);
    assert.strictEqual(pk22Entity?.key, pk22);
  });

  it("get round1 of task1", async function () {
    const info = await hlr.getTaskRound(taskID, round);

    assert.strictEqual(info.round, round);
    assert.strictEqual(info.status, entity.RoundStatus.Started);
    assert.lengthOf(info.joinedClients, 3);
    assert.includeMembers(info.joinedClients, [address1, address2, address3]);
    assert.lengthOf(info.finishedClients, 0);
  });

  it("select node2 and node3", async function () {
    await hlr.selectCandidates(address1, taskID, round, [address2, address3]);

    const em = db.getEntityManager();
    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round }, [
      "members",
    ]);
    assert.exists(roundEntity);

    for (const member of roundEntity!.members) {
      if (member.address === address1) {
        assert.strictEqual(member.status, entity.RoundStatus.Started);
      } else {
        assert.strictEqual(member.status, entity.RoundStatus.Running);
      }
    }
  });

  const seedShareCommitment22 = randomBytesString(32);
  const seedShareCommitment23 = randomBytesString(32);
  const seedShareCommitment32 = randomBytesString(32);
  const seedShareCommitment33 = randomBytesString(32);

  const skShareCommitment22 = randomBytesString(32);
  const skShareCommitment23 = randomBytesString(32);
  const skShareCommitment32 = randomBytesString(32);
  const skShareCommitment33 = randomBytesString(33);
  it("node2,3 uploadSecretKeyCommitment", async function () {
    await hlr.uploadSeedCommitment(
      address2,
      taskID,
      round,
      [address2, address3],
      [seedShareCommitment22, seedShareCommitment23]
    );
    await hlr.uploadSeedCommitment(
      address3,
      taskID,
      round,
      [address2, address3],
      [seedShareCommitment32, seedShareCommitment33]
    );
    await hlr.uploadSecretKeyCommitment(
      address2,
      taskID,
      round,
      [address2, address3],
      [skShareCommitment22, skShareCommitment23]
    );
    await hlr.uploadSecretKeyCommitment(
      address3,
      taskID,
      round,
      [address2, address3],
      [skShareCommitment32, skShareCommitment33]
    );

    const ssDatas2 = await hlr.getSecretShareDatas(taskID, round, [address2, address3], address2);
    const ssDatas3 = await hlr.getSecretShareDatas(taskID, round, [address2, address3], address3);

    assert.strictEqual(ssDatas2[0].seedCommitment, seedShareCommitment22);
    assert.strictEqual(ssDatas3[0].seedCommitment, seedShareCommitment23);
    assert.strictEqual(ssDatas2[1].seedCommitment, seedShareCommitment32);
    assert.strictEqual(ssDatas3[1].seedCommitment, seedShareCommitment33);

    assert.strictEqual(ssDatas2[0].secretKeyCommitment, skShareCommitment22);
    assert.strictEqual(ssDatas3[0].secretKeyCommitment, skShareCommitment23);
    assert.strictEqual(ssDatas2[1].secretKeyCommitment, skShareCommitment32);
    assert.strictEqual(ssDatas3[1].secretKeyCommitment, skShareCommitment33);
  });
  it("get node2,3 public keys", async function () {
    const pks = await hlr.getClientPublicKeys(taskID, round, [address2, address3]);

    assert.strictEqual(pks[0][0], pk21);
    assert.strictEqual(pks[0][1], pk22);
    assert.strictEqual(pks[1][0], pk31);
    assert.strictEqual(pks[1][1], pk32);
  });

  it("node2,3 start calculation", async function () {
    await hlr.startCalculation(address1, taskID, round, [address2, address3]);

    const em = db.getEntityManager();
    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round });
    assert.strictEqual(roundEntity?.status, entity.RoundStatus.Calculating);

    const members = await em.find(entity.HLRRoundMember, {
      round: roundEntity,
      status: entity.RoundStatus.Calculating,
    });
    assert.lengthOf(members, 2);
    const memberAddrs = members.map((member) => member.address);
    assert.includeMembers(memberAddrs, [address2, address3]);
  });

  const resultCommitment2 = randomBytesString(32);
  it("node2 upload result commitment", async function () {
    await hlr.uploadResultCommitment(address2, taskID, round, resultCommitment2);

    const resultCommitment2_ = await hlr.getResultCommitment(taskID, round, address2);
    assert.strictEqual(resultCommitment2, resultCommitment2_);
    assert.isRejected(hlr.getResultCommitment(taskID, round, address3), Error);
  });

  it("node2 startAggregation", async function () {
    await hlr.startAggregation(address1, taskID, round, [address2]);

    const em = db.getEntityManager();
    const roundEntity = await em.findOne(entity.HLRRound, { task: { outID: taskID }, round: round });
    assert.strictEqual(roundEntity?.status, entity.RoundStatus.Aggregating);

    const members = await em.find(entity.HLRRoundMember, {
      round: roundEntity,
      status: entity.RoundStatus.Aggregating,
    });
    const memberAddrs = members.map((member) => member.address);
    assert.lengthOf(memberAddrs, 1);
    assert.include(memberAddrs, address2);
  });

  const seedShare22 = randomBytesString(32);
  it("node2 upload node2 seed", async function () {
    await hlr.uploadSeed(address2, taskID, round, [address2], [seedShare22]);

    const ssDatas = await hlr.getSecretShareDatas(taskID, round, [address2], address2);
    assert.notExists(ssDatas[0].secretKey);
    assert.exists(ssDatas[0].secretKeyCommitment);
    assert.strictEqual(ssDatas[0].seed, seedShare22);
    assert.strictEqual(ssDatas[0].seedCommitment, seedShareCommitment22);
  });

  const skShare32 = randomBytesString(32);
  it("node2 upload node3 sk", async function () {
    await hlr.uploadSecretKey(address2, taskID, round, [address3], [skShare32]);

    const ssDatas = await hlr.getSecretShareDatas(taskID, round, [address3], address2);
    assert.notExists(ssDatas[0].seed);
    assert.exists(ssDatas[0].seedCommitment);
    assert.strictEqual(ssDatas[0].secretKey, skShare32);
    assert.strictEqual(ssDatas[0].secretKeyCommitment, skShareCommitment32);
  });

  it("endRound", async function () {
    await hlr.endRound(address1, taskID, round);

    const em = db.getEntityManager();
    const roundEntity = await em.findOne(entity.HLRRound, {
      task: { outID: taskID },
      round: round,
    });
    assert.strictEqual(roundEntity?.status, entity.RoundStatus.Finished);

    const r = await hlr.getTaskRound(taskID, round);
    assert.lengthOf(r.finishedClients, 1);
    assert.include(r.finishedClients, address2);
  });

  it("finishTask", async function () {
    await hlr.finishTask(address1, taskID);

    const taskInfo = await hlr.getTask(taskID);
    assert.isTrue(taskInfo.finished);
  });
});

describe("hlr coordinator verify", () => {
  let address1: string;
  let address2: string;
  let address3: string;
  let taskID: string;
  const dataset = "mnist";
  const taskCommitment = randomBytesString(32);
  const enableVerify = true;
  const tolerance = 6;
  const round = 1;
  const weightCommitment = "0x09ea9ed6d70cd296187459b9256c3f290565ccedc317f96f539bc46df73cda92";

  before(async function () {
    const dbConfig: Options = {
      type: "sqlite",
      dbName: ":memory:",
      entities: ["dist/entity/**/*.js"],
      entitiesTs: ["src/entity/**/*.ts"],
    };
    await hlr.init(dbConfig);

    address1 = (await identity.join("127.0.0.1:6700", "1"))[1];
    address2 = (await identity.join("127.0.0.1:6800", "2"))[1];
    address3 = (await identity.join("127.0.0.1:6900", "3"))[1];
    const nodes = [address1, address2, address3];

    await datahub.register(
      address1,
      dataset,
      0,
      "0x1b9e1999bd3aede0f518ac01efbbc4c6397f311f8fb1b4d9a789b92440e87790"
    );
    await datahub.register(
      address2,
      dataset,
      0,
      "0x2be97c3a6dff81e5db01463a44e2057d77cabb72c17510b523c759d237601940"
    );
    await datahub.register(
      address3,
      dataset,
      0,
      "0x241074e8fd5a7b5b87c23b76a2ab58b48054d84971a204b6d3ca02b87475cec9"
    );
    // create task
    taskID = (await hlr.createTask(address1, dataset, taskCommitment, enableVerify, tolerance))[1];
    // start round
    await hlr.startRound(address1, taskID, round, weightCommitment);
    // join round
    const pk1s = [randomBytesString(32), randomBytesString(32), randomBytesString(32)];
    const pk2s = [randomBytesString(32), randomBytesString(32), randomBytesString(32)];

    for (let i = 0; i < 3; i++) {
      await hlr.joinRound(nodes[i], taskID, round, pk1s[i], pk2s[i]);
    }
    // select candidates
    await hlr.selectCandidates(address1, taskID, round, nodes);
    // upload seed and sk commitments
    const seedCommitments = [randomBytesString(32), randomBytesString(32), randomBytesString(32)];
    const skCommitments = [randomBytesString(32), randomBytesString(32), randomBytesString(32)];
    for (let i = 0; i < 3; i++) {
      await hlr.uploadSeedCommitment(nodes[i], taskID, round, nodes, seedCommitments);
      await hlr.uploadSecretKeyCommitment(nodes[i], taskID, round, nodes, skCommitments);
    }
    // start calculate
    await hlr.startCalculation(address1, taskID, round, nodes);
    // upload result commitments
    const resultCommitments = [randomBytesString(32), randomBytesString(32), randomBytesString(32)];
    for (let i = 0; i < 3; i++) {
      await hlr.uploadResultCommitment(nodes[i], taskID, round, resultCommitments[i]);
    }
    // start aggregation
    await hlr.startAggregation(address1, taskID, round, nodes);
    // upload seeds
    const seeds = [randomBytesString(32), randomBytesString(32), randomBytesString(32)];
    for (let i = 0; i < 3; i++) {
      await hlr.uploadSeed(nodes[i], taskID, round, nodes, seeds);
    }
    // end round
    await hlr.endRound(address1, taskID, round);
    // finish task
    await hlr.finishTask(address1, taskID);
  });

  after(async function () {
    await identity.leave(address1);
    await identity.leave(address2);
    await identity.leave(address3);

    const orm = db.getORM();
    const generator = orm.getSchemaGenerator();
    await generator.dropSchema();
    await db.close();
  });

  const proofs = [
    "{\"A\":[\"636263409642223480755202506638931949375986131692717851857258308190530345326\",\"3458166464521518318248967484557553570159238134090644197643926714109574042932\",\"1\"],\"B\":[\"14362586937602535814816823496985574360269467705227751911961015587656944948083\",\"1870620977389133455253816535345976517130532597691250104906065470129588350120\",\"1\"],\"C\":[\"18954541704309916040148652646335478583861155457345473439643061773104903810248\",\"13664293841463047803872783542454630100774207583451843726772602648738914608595\",\"1\"],\"Z\":[\"14749978331526011815543264205861361632624185274345833155767367110081325786792\",\"21249511926596568465274108576891414111830507942957030375018835529475321428875\",\"1\"],\"T1\":[\"7181157147208144283611167454066297144944141619789892715375833966149251924799\",\"4260460871613446379187866385285753935617339590991362801611692341679983890271\",\"1\"],\"T2\":[\"3013255070272528442566986847471590750638067260181241811920783941478585829677\",\"3023576744162355144559140787496505103014134281023991682400197778517716110101\",\"1\"],\"T3\":[\"16012144006274061429352636468965994654407264487927925309709095205269370823369\",\"2414695899212897788171871583946359249504526384995686713923732734864250063841\",\"1\"],\"eval_a\":\"13301639695968749561235390383633865826171532168089467079500126385009181431809\",\"eval_b\":\"15698999220889832822174817004790052405753361649565587529229026309890841979995\",\"eval_c\":\"1835434663319944499369926979451853223238647503891906722714108222860394001226\",\"eval_s1\":\"15381887482378061156033203087720242647578585121796569119915935212952127612774\",\"eval_s2\":\"10298249318421057064492178076544439958096078088122025717723938505045913912138\",\"eval_zw\":\"1075182852359312608839765494621622851108123872093631717655984591450492764423\",\"eval_r\":\"19922321998626883430598586253357083029674759223177760170909215199869805604271\",\"Wxi\":[\"15175945916337081668609561261549156520831324477974389284775681172043139897251\",\"4459935903798911969757623578487967899666407156829131324391968101404929508871\",\"1\"],\"Wxiw\":[\"15861756358030334766990188818995173244254089501947528941883220354753815467096\",\"15958868884643683813190873244625119479193175861084626962762340137214113278956\",\"1\"],\"protocol\":\"plonk\",\"curve\":\"bn128\"}",
    "{\"A\":[\"10201766182318390498919617662818124451550924630275728066962785918152958813695\",\"7692040760434874490692730916383710304115391886514908287992109072298127228086\",\"1\"],\"B\":[\"16995345029353593869483735783501243549415890640635303987421877357445050706653\",\"2274866988402514370365813544034078073473299045512967072355449175785562595522\",\"1\"],\"C\":[\"3722138560167132590950103463392844562229920810328348513004530071653046571370\",\"4953724288499275004329260844790486532519296645530091617959242047797258414162\",\"1\"],\"Z\":[\"16117458493521502499030216325194362936543947507923289430554854127538099051243\",\"7168128952139318498075205717404532277170387509020152217971285456997089981500\",\"1\"],\"T1\":[\"17199818305385411680669022484205095014862714686580002930950392865395671624974\",\"20434044239056974227934901896776251541519238476001638423318671421935113700305\",\"1\"],\"T2\":[\"14032168300407693837819296269578287938684658404818428067693223672814180744433\",\"3959425883744544331128249210725382621096477897003014595343808044002163563129\",\"1\"],\"T3\":[\"6717685997012119971554582268223656573367350973444358488457856924145846007760\",\"15418951194387802092738131112131854453543194031882416501845031941586849236030\",\"1\"],\"eval_a\":\"5165322019589329051387088458590623273148471955019057533338438296700541429557\",\"eval_b\":\"12516841898465784974493889023139953693036941920668167390057155752231635923597\",\"eval_c\":\"21332989640146320839435297115044517147939849083692976986856816551227328467473\",\"eval_s1\":\"7252063946591885961769852866671579641148144156343543623208929650887563180149\",\"eval_s2\":\"3142910082467450691287502228669806028796045187605749477625032893617230481298\",\"eval_zw\":\"15474864090022579630535596147802637122830991670067511032436221311680137424646\",\"eval_r\":\"20809723015255515596170335060226758410837510910662839839953047264525125036264\",\"Wxi\":[\"9751402076239875503490391755321513611911213400600879218470509857067881486762\",\"7232721141308555240521641732670986415951362290401084496102306116385101555660\",\"1\"],\"Wxiw\":[\"11453260782221731677569216310524360715403053655064520052385788918361046021825\",\"6177262061655645398246982113368549280635540859452500293759939266353897885636\",\"1\"],\"protocol\":\"plonk\",\"curve\":\"bn128\"}",
    "{\"A\":[\"7810341043811434553304412463143328454474040471341396296333760861548277872972\",\"17871664500156349738275586627624518370214464280532930477325659094226251293860\",\"1\"],\"B\":[\"21250975838173654745160419065957220599080942185211087325925415209899967703886\",\"12864287637769302327570202908254339881828156077239269158241757932606332671216\",\"1\"],\"C\":[\"16264802578454110031792395480942676222676098922336730776806123255011731125580\",\"12380327334271834981752166574701783373848594054944095608196148303813390159595\",\"1\"],\"Z\":[\"20867125470149046691287054687390483701781691872248951344158469222892640215199\",\"20698594616375644181756596774138307087191308540922244171595807021536946256170\",\"1\"],\"T1\":[\"14027997370454885542078567851298467636275931962825282257965176567972921797648\",\"4583908019021434618811063325013661441584367591988239683807287767490437292623\",\"1\"],\"T2\":[\"18115049802118399753605762287347258454670572228215645326431712371504095972264\",\"14938166230016345022119659983200951587939795304459707607372827134888692153782\",\"1\"],\"T3\":[\"496554307343463788471264212600006195699003167354537347116398984572659669235\",\"12600374085758488977319323811323571622572129336711384499798090882052841131051\",\"1\"],\"eval_a\":\"21860611171458159563688953729584858160679606147048834184949833259294838356920\",\"eval_b\":\"5370997268445589863206898669076474412687340151858939573831150132405532460352\",\"eval_c\":\"8129466471899890168763697203831193215953962492776620499156326047141019925340\",\"eval_s1\":\"16368713937860596040887830512082616286409925981365669155524258370657007206291\",\"eval_s2\":\"12096924809822674480209780431441345268604859570228515944651877226830766067463\",\"eval_zw\":\"14432666522905150058451384114601587551704464844615049020056807775114103588727\",\"eval_r\":\"13277406045342964894771318748742963789574086518135036494158427763962439454663\",\"Wxi\":[\"6337971766967356551904455070471649830717167017003560134698359121841344063210\",\"19486901981639057920431837914591748169616138783874328649424618842339091277700\",\"1\"],\"Wxiw\":[\"5000650010380156237683217137580336709609406128747552701033888265028924745448\",\"12847108487267202313321500227308057507964005886143285748675475884976832451660\",\"1\"],\"protocol\":\"plonk\",\"curve\":\"bn128\"}",
  ];
  const pubSignals = [
    [
      "45191926979062500000000000000",
      "29",
      "267591953685000000000000000000",
      "29",
      "0",
      "29",
      "4485354118406336729363675711000348342713746016780773923827638902243253344914",
      "12491785436441952246131977283207663900873480131562437076931999384071026800528",
    ],
    [
      "21888242871839275222246405745257275088548364400217667441191091686575808495617",
      "29",
      "21888242871839275222246405745257275088548364399203758953116954186575808495617",
      "29",
      "21888242871839275222246405745257275088548364400409565310208204186575808495617",
      "29",
      "4485354118406336729363675711000348342713746016780773923827638902243253344914",
      "19861985246981876418728550686255895000926031790661800238032715054840083913024",
    ],
    [
      "153174931802687500000000000000",
      "29",
      "944683110907500000000000000000",
      "29",
      "6469025953750000000000000000",
      "29",
      "4485354118406336729363675711000348342713746016780773923827638902243253344914",
      "16312338985999130487669968592409656989667313122563190074205820551564218453705",
    ],
  ];

  it("verify", async () => {
    const state1 = await hlr.getVerifierState(taskID);
    assert.isTrue(state1.valid);
    assert.lengthOf(state1.invalidClients, 0);
    assert.lengthOf(state1.unfinishedClients, 3);
    assert.includeMembers(state1.unfinishedClients, [address1, address2, address3]);
    assert.isNotTrue(state1.confirmed);

    await assert.isRejected(hlr.confirmVerification(address1, taskID));
    const fut1 = hlr.verify(address1, taskID, 3, proofs[0], pubSignals[0], 0, 10);
    const fut2 = hlr.verify(address2, taskID, 3, proofs[1], pubSignals[1], 0, 10);
    const fut3 = hlr.verify(address3, taskID, 3, proofs[2], pubSignals[2], 0, 10);
    const [[, valid1], [, valid2], [, valid3]] = await Promise.all([fut1, fut2, fut3]);
    assert.isTrue(valid1);
    assert.isTrue(valid2);
    assert.isTrue(valid3);

    await hlr.confirmVerification(address1, taskID);

    const state2 = await hlr.getVerifierState(taskID);
    assert.isTrue(state2.valid);
    assert.lengthOf(state2.invalidClients, 0);
    assert.lengthOf(state2.unfinishedClients, 0);
    assert.isTrue(state2.confirmed);
  });
});
