import { Collection, Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import * as crypto from "crypto";
import { Round } from ".";

@Entity()
export class Task {
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

  @Property()
  taskType!: string;

  //taskID for display
  @Property()
  outID!: string;

  @OneToMany(() => Round, (round) => round.task)
  rounds = new Collection<Round>(this);

  constructor(address: string, dataset: string, commitment: string, taskType: string) {
    this.address = address;
    this.dataset = dataset;
    this.commitment = commitment;
    this.taskType = taskType;
    this.outID = crypto.randomBytes(32).toString("hex");
  }
}
