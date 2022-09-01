import { getHorizontal } from "./horizontal";
import { getIdentity } from "./identity";

const impls = [getIdentity, getHorizontal];

export async function init(): Promise<void> {
  await Promise.all(impls.map((f) => f().init()));
}

export { getIdentity, getHorizontal };
