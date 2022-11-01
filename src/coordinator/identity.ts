import * as entity from "~/entity/identity";
import * as db from "~/db";
import { randomHex } from "~/utils";
import { IdentityImpl } from "~/impl/identity";
import dbConfig from "~/db/config";

class Identity implements IdentityImpl {
  async init(cfg = dbConfig): Promise<void> {
    await db.init(cfg);
  }

  async join(url: string, name: string): Promise<[string, string]> {
    const em = db.getEntityManager();
    let node = await em.findOne(entity.Node, { url: url });

    if (!node) {
      node = new entity.Node(url, name);
      em.persist(node);
    } else {
      node.refresh();
    }
    await em.flush();
    return [randomHex(32), node.address];
  }

  async updateUrl(address: string, url: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });

    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    if (!node.isAlive()) {
      throw new Error(`node of address ${address} is not alive`);
    }
    node.url = url;
    await em.persistAndFlush(node);
    return randomHex(32);
  }

  async updateName(address: string, name: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    if (!node.isAlive()) {
      throw new Error(`node of address ${address} is not alive`);
    }
    node.name = name;
    await em.persistAndFlush(node);
    return randomHex(32);
  }

  async leave(address: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    if (!node.isAlive()) {
      throw new Error(`node of address ${address} is not alive`);
    }

    node.leave();
    await em.flush();
    return randomHex(32);
  }

  async getNodeInfo(address: string): Promise<entity.NodeInfo> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    if (!node.isAlive()) {
      throw new Error(`node of address ${address} is not alive`);
    }
    return node;
  }

  async getNodes(page: number, pageSize: number): Promise<entity.NodeInfosPage> {
    const em = db.getEntityManager();
    const timestamp = Math.floor(Date.now() / 1000);
    const [nodes, count] = await em.findAndCount(
      entity.Node,
      { timeout: { $gte: timestamp} },
      { orderBy: { id: "ASC" }, limit: pageSize, offset: (page - 1) * pageSize }
    );
    return {
      totalCount: count,
      nodes: nodes,
    };
  }
}

export const identity = new Identity();
