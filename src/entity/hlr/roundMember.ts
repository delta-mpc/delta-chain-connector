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
import { Key, HLRResultCommitment } from ".";
import { RoundStatus, HLRRound } from "./round";

@Entity()
export class HLRRoundMember {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => HLRRound)
  round!: HLRRound;

  // member node address
  @Property()
  address!: string;

  // member status in a round
  @Enum({ items: () => RoundStatus, type: "number" })
  status!: RoundStatus;

  @OneToMany(() => Key, (key) => key.member)
  keys = new Collection<Key>(this);

  @OneToOne(() => HLRResultCommitment, (result) => result.member)
  result!: HLRResultCommitment;

  constructor(round: HLRRound, address: string, status: RoundStatus) {
    this.round = round;
    this.address = address;
    this.status = status;
  }
}
