import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { HLRRoundMember } from ".";

@Entity()
export class HLRShare {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => HLRRoundMember)
  sender!: HLRRoundMember;

  @ManyToOne(() => HLRRoundMember)
  receiver!: HLRRoundMember;

  // hex string
  @Property()
  share!: string;

  @Enum({ items: () => ShareType, type: "number" })
  type!: ShareType;

  constructor(sender: HLRRoundMember, receiver: HLRRoundMember, share: string, type: ShareType) {
    this.sender = sender;
    this.receiver = receiver;
    this.share = share;
    this.type = type;
  }
}

export enum ShareType {
  Seed,
  SecretKey,
}

export interface SecretShareData {
  seed?: string;
  seedCommitment?: string;
  secretKey?: string;
  secretKeyCommitment?: string;
}
