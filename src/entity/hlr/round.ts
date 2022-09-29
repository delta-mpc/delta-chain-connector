import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { HLRRoundMember, HLRTask } from ".";

export enum RoundStatus {
  Started,
  Running,
  Calculating,
  Aggregating,
  Finished,
}

@Entity()
export class HLRRound {
  @PrimaryKey()
  id!: number;

  // round number
  @Property()
  round!: number;

  // weight commitment
  @Property()
  weightCommitment!: string;

  // status
  @Enum({ items: () => RoundStatus, type: "number" })
  status!: RoundStatus;

  @ManyToOne(() => HLRTask)
  task!: HLRTask;

  @OneToMany(() => HLRRoundMember, (member) => member.round)
  members = new Collection<HLRRoundMember>(this);

  constructor(task: HLRTask, round: number, weightCommitment: string, status: RoundStatus) {
    this.task = task;
    this.round = round;
    this.weightCommitment = weightCommitment;
    this.status = status;
  }
}

export interface TaskRoundInfo {
  round: number;
  status: number;
  joinedClients: string[];
  finishedClients: string[];
}
