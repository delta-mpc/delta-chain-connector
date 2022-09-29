import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class DataRecord {
  @PrimaryKey()
  id!: number;

  @Property()
  owner!: string;

  @Property()
  name!: string;

  @Property({ type: "number" })
  index!: number;

  @Property()
  commitment!: string;

  constructor(owner: string, name: string, index: number, commitment: string) {
    this.owner = owner;
    this.name = name;
    this.index = index;
    this.commitment = commitment;
  }
}
