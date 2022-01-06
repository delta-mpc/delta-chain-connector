import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { KeyType } from "impl/service";
import { RoundMember } from ".";

@Entity()
export class Key {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => RoundMember)
  member!: RoundMember;

  // public key
  @Property()
  key!: string;

  // key type
  @Enum({ items: () => KeyType, type: "number" })
  type!: KeyType;

  constructor(member: RoundMember, key: string, type: KeyType) {
    this.member = member;
    this.key = key;
    this.type = type;
  }
}
