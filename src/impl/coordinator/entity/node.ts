import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as crypto from "crypto";

@Entity()
export class Node {
  @PrimaryKey()
  id!: number;

  @Property()
  url!: string;

  @Property()
  name!: string;

  @Property()
  address!: string;

  @Property()
  joined = false;

  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
    this.address = crypto.randomBytes(48).toString("hex");
  }
}
