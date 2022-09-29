import path from "path";
import { config } from "~/config";
import * as entity from "~/entity/identity";
import { IdentityImpl } from "~/impl/identity";
import { ContractHelper, ContractOption } from "./contract";

class Identity implements IdentityImpl {
  private option!: ContractOption;
  contract!: ContractHelper;

  async init(opt?: ContractOption): Promise<void> {
    this.option = opt || {
      contractAddress: config.ethereum.identity.contractAddress,
      abiFile: path.resolve(__dirname + "/../contract/IdentityContract.json"),
      nodeAddress: config.ethereum.nodeAddress,
      privateKey: config.ethereum.privateKey,
      provider: config.ethereum.provider,
      gasPrice: config.ethereum.gasPrice,
      gasLimit: config.ethereum.gasLimit,
      chainParam: config.ethereum.chainParam,
    };
    this.contract = new ContractHelper(this.option);
    await this.contract.init();
  }

  async join(url: string, name: string): Promise<[string, string]> {
    const hash = await this.contract.method("join", [url, name]);
    const receipt = await this.contract.waitForReceipt(hash);
    const res = this.contract.decodeLogs(receipt.logs);
    if (!res) {
      throw new Error("join has no result");
    }
    return [receipt.transactionHash, res.addr];
  }

  async updateUrl(address: string, url: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    const hash = await this.contract.method("updateUrl", [url]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }

  async updateName(address: string, name: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    const hash = await this.contract.method("updateName", [name]);
    await this.contract.waitForReceipt(hash);
    return hash;
  }

  async leave(address: string): Promise<string> {
    if (address !== this.option.nodeAddress) {
      throw new Error(`chain connector node address is not ${address}`);
    }
    const hash = await this.contract.method("leave");
    return hash;
  }

  async getNodeInfo(address: string): Promise<entity.NodeInfo> {
    const res = await this.contract.call("getNodeInfo", [address]);
    if (typeof res === "string") {
      throw new Error("getNodeInfo return type error");
    }
    return {
      address: address,
      url: res.url,
      name: res.name,
    };
  }

  async getNodes(page: number, pageSize: number): Promise<entity.NodeInfosPage> {
    const res = await this.contract.call("getNodes", [page, pageSize]);
    if (typeof res === "string") {
      throw new Error("getNodeInfo return type error");
    }
    const nodes = res[0].map((node: any) => {
      return {
        address: node.addr,
        url: node.url,
        name: node.name,
      };
    });
    return {
      nodes: nodes,
      totalCount: Number(res[1]),
    };
  }
}

export const identity = new Identity();
