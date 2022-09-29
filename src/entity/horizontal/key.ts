import { Entity, Enum, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";
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

export enum KeyType {
  PK1, // public key for communication encryption
  PK2, // public key for mask generation
}
