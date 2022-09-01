import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { RoundMember } from "./roundMember";
import { ShareType } from "./share";

@Entity()
export class ShareCommitment {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => RoundMember)
  sender!: RoundMember;

  @ManyToOne(() => RoundMember)
  receiver: RoundMember;

  // hex string
  @Property()
  commitment!: string;

  @Enum({ items: () => ShareType, type: "number" })
  type!: ShareType;

  constructor(sender: RoundMember, receiver: RoundMember, commitment: string, type: ShareType) {
    this.sender = sender;
    this.receiver = receiver;
    this.commitment = commitment;
    this.type = type;
  }
}
