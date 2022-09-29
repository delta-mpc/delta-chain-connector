import { Entity, OneToOne, PrimaryKey, Property } from "@mikro-orm/core";
import { RoundMember } from ".";

@Entity()
export class ResultCommitment {
  @PrimaryKey()
  id!: number;

  @Property()
  commitment!: string;

  @OneToOne(() => RoundMember, (member) => member.result, { owner: true })
  member!: RoundMember;

  constructor(member: RoundMember, commitment: string) {
    this.member = member;
    this.commitment = commitment;
  }
}
