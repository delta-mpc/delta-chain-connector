import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { HLRRoundMember } from "./roundMember";
import { ShareType } from "./share";

@Entity()
export class HLRShareCommitment {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => HLRRoundMember)
  sender!: HLRRoundMember;

  @ManyToOne(() => HLRRoundMember)
  receiver: HLRRoundMember;

  // hex string
  @Property()
  commitment!: string;

  @Enum({ items: () => ShareType, type: "number" })
  type!: ShareType;

  constructor(sender: HLRRoundMember, receiver: HLRRoundMember, commitment: string, type: ShareType) {
    this.sender = sender;
    this.receiver = receiver;
    this.commitment = commitment;
    this.type = type;
  }
}
