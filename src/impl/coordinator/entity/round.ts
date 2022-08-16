import { Collection, Entity, Enum, ManyToOne, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { RoundStatus } from "~/impl/service";
import { RoundMember, Task } from ".";

@Entity()
export class Round {
  @PrimaryKey()
  id!: number;

  // round number
  @Property()
  round!: number;

  // status
  @Enum({ items: () => RoundStatus, type: "number" })
  status!: RoundStatus;

  @ManyToOne(() => Task)
  task!: Task;

  @OneToMany(() => RoundMember, (member) => member.round)
  members = new Collection<RoundMember>(this);

  constructor(task: Task, round: number, status: RoundStatus) {
    this.task = task;
    this.round = round;
    this.status = status;
  }
}
