import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import * as crypto from "crypto";
import { HLRRound } from ".";

@Entity()
export class HLRTask {
  @PrimaryKey()
  id!: number;

  // address of node which create the task
  @Property()
  address!: string;

  // dataset name of this task
  @Property()
  dataset!: string;

  // hash of training code. hex encoding string
  @Property()
  commitment!: string;

  // whether to enable verification
  @Property()
  enableVerify!: boolean;

  // hlr convergence tolerance, integer
  @Property()
  tolerance!: number;

  //taskID for display
  @Property()
  outID!: string;

  @Property()
  finished!: boolean;

  @OneToMany(() => HLRRound, (round) => round.task)
  rounds = new Collection<HLRRound>(this);

  constructor(
    address: string,
    dataset: string,
    commitment: string,
    enableVerify: boolean,
    tolerance: number
  ) {
    this.address = address;
    this.dataset = dataset;
    this.commitment = commitment;
    this.enableVerify = enableVerify;
    this.tolerance = tolerance;
    this.outID = "0x" + crypto.randomBytes(32).toString("hex");
    this.finished = false;
  }
}

export interface TaskInfo {
  address: string;
  url: string;
  taskID: string;
  dataset: string;
  commitment: string;
  taskType: string;
  finished: boolean;
  enableVerify: boolean;
  tolerance: number;
}
