import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { ShareType } from "~/horizontal/impl/impl";
import { RoundMember } from ".";

@Entity()
export class Share {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => RoundMember)
  sender!: RoundMember;

  @ManyToOne(() => RoundMember)
  receiver!: RoundMember;

  // hex string
  @Property()
  share!: string;

  @Enum({ items: () => ShareType, type: "number" })
  type!: ShareType;

  constructor(sender: RoundMember, receiver: RoundMember, share: string, type: ShareType) {
    this.sender = sender;
    this.receiver = receiver;
    this.share = share;
    this.type = type;
  }
}
