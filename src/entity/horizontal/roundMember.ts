import {
  Collection,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from "@mikro-orm/core";
import { Key, ResultCommitment, Round } from ".";
import { RoundStatus } from "./round";

@Entity()
export class RoundMember {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Round)
  round!: Round;

  // member node address
  @Property()
  address!: string;

  // member status in a round
  @Enum({ items: () => RoundStatus, type: "number" })
  status!: RoundStatus;

  @OneToMany(() => Key, (key) => key.member)
  keys = new Collection<Key>(this);

  @OneToOne(() => ResultCommitment, (result) => result.member)
  result!: ResultCommitment;

  constructor(round: Round, address: string, status: RoundStatus) {
    this.round = round;
    this.address = address;
    this.status = status;
  }
}
