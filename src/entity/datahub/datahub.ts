import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class DataRecord {
  @PrimaryKey()
  id!: number;

  @Property()
  owner!: string;

  @Property()
  name!: string;

  @Property()
  commitment!: string;

  @Property({type: "number"})
  version = 1;

  constructor(owner: string, name: string, commitment: string) {
    this.owner = owner;
    this.name = name;
    this.commitment = commitment;
  }
}
