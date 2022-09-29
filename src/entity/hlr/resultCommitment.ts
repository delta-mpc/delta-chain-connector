import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { HLRRoundMember } from ".";

@Entity()
export class HLRResultCommitment {
  @PrimaryKey()
  id!: number;

  @Property()
  commitment!: string;

  @OneToOne(() => HLRRoundMember, (member) => member.result, { owner: true })
  member!: HLRRoundMember;

  constructor(member: HLRRoundMember, commitment: string) {
    this.member = member;
    this.commitment = commitment;
  }
}
