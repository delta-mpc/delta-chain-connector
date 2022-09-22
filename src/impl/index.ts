import { getDataHub } from "./datahub";
import { getHLR } from "./hlr";
import { getHorizontal } from "./horizontal";
import { getIdentity } from "./identity";

const impls = [getIdentity, getHorizontal, getDataHub, getHLR];

export async function init(): Promise<void> {
  await Promise.all(impls.map((f) => f().init()));
}

export { getIdentity, getHorizontal, getDataHub, getHLR };
