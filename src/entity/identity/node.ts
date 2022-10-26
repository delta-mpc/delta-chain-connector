import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import * as crypto from "crypto";

export const NodeAliveTimeout = 60 * 2;

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
  timeout!: number;

  constructor(url: string, name: string) {
    this.url = url;
    this.name = name;
    const timestamp = Math.floor(Date.now() / 1000);
    this.timeout = timestamp + NodeAliveTimeout;
    this.address = crypto.randomBytes(48).toString("hex");
  }

  refresh() {
    const timestamp = Math.floor(Date.now() / 1000);
    this.timeout = timestamp + NodeAliveTimeout;
  }

  leave() {
    this.timeout = 0;
  }

  isAlive(): boolean {
    const timestamp = Math.floor(Date.now() / 1000);
    return timestamp < this.timeout;
  }
}

export interface NodeInfo {
  address: string;
  url: string;
  name: string;
}

export interface NodeInfosPage {
  nodes: NodeInfo[];
  totalCount: number;
}
