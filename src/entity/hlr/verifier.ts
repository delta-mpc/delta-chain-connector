import { Entity, ManyToOne, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
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

  @OneToOne(() => HLRTask)
  task!: HLRTask;

  constructor(task: HLRTask) {
    this.task = task;
  }
}

@Entity()
export class HLRMemberVerifier {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => HLRVerifier)
  verifier!: HLRVerifier;

  @OneToOne(() => HLRRoundMember)
  member!: HLRRoundMember;

  @Property()
  valid = true;

  @Property()
  samples!: number;

  @Property()
  gradients!: string[];

  @Property()
  precision!: number;

  constructor(
    verifier: HLRVerifier,
    member: HLRRoundMember,
    samples: number,
    gradients: string[],
    precision: number
  ) {
    this.verifier = verifier;
    this.member = member;
    this.samples = samples;
    this.gradients = gradients;
    this.precision = precision;
  }
}

export interface VerifierState {
  unfinishedClients: string[];
  invalidClients: string[];
  valid: boolean;
  confirmed: boolean;
}
