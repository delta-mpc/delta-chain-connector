import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { HLRRoundMember } from "./roundMember";
import { HLRTask } from "./task";

@Entity()
export class HLRVerifier {
  @PrimaryKey()
  id!: number;

  @Property({ default: false, type: "boolean" })
  valid = true;

  @Property({ default: false, type: "boolean" })
  confirmed = false;

  @Property()
  gradients!: string[];

  @Property()
  precision!: number;

  @Property()
  samples!: number;

  @OneToOne(() => HLRTask)
  task!: HLRTask;

  constructor(task: HLRTask, gradients: string[], precision: number) {
    this.task = task;
    this.gradients = gradients;
    this.precision = precision;
    this.samples = 0;
  }
}

@Entity()
export class HLRMemberVerifier {
  @PrimaryKey()
  id!: number;

  @OneToOne(() => HLRRoundMember)
  member!: HLRRoundMember;

  @Property()
  valid = true;

  constructor(member: HLRRoundMember) {
    this.member = member;
  }
}

export interface VerifierState {
  unfinishedClients: string[];
  invalidClients: string[];
  valid: boolean;
  confirmed: boolean;
}
