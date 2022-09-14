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
    const node = await em.findOne(entity.Node, { url: url });
    if (!node) {
      const node = new entity.Node(url, name);
      node.joined = true;
      await em.persistAndFlush(node);
      return [randomHex(32), node.address];
    } else if (node.joined == false) {
      // check node.joined explictly. Note: node.joined is a integer in database, so we should use == instead of === to check it.
      node.joined = true;
      await em.flush();
      return [randomHex(32), node.address];
    } else {
      throw new Error(`node ${node.address} has already joined`);
    }
  }

  async updateUrl(address: string, url: string): Promise<string> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });

    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
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
    node.joined = false;
    await em.flush();
    return randomHex(32);
  }

  async getNodeInfo(address: string): Promise<entity.NodeInfo> {
    const em = db.getEntityManager();
    const node = await em.findOne(entity.Node, { address: address });
    if (!node) {
      throw new Error(`node of address ${address} doesn't exist`);
    }
    return node;
  }

  async getNodes(page: number, pageSize: number): Promise<entity.NodeInfosPage> {
    const em = db.getEntityManager();
    const [nodes, count] = await em.findAndCount(
      entity.Node,
      { joined: true },
      { orderBy: { id: "ASC" }, limit: pageSize, offset: (page - 1) * pageSize }
    );
    return {
      totalCount: count,
      nodes: nodes,
    };
  }
}

export const identity = new Identity();
