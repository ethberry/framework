import { Contract } from "ethers";

import { shouldCapped, shouldSnapshot, shouldBase, shouldBurnable } from "@gemunion/contracts-erc20";
import { shouldReceive } from "./receive";

export function shouldSimple(factory: () => Promise<Contract>) {
  shouldBase(factory);
  shouldBurnable(factory);
  shouldCapped(factory);
  shouldReceive(factory);
  shouldSnapshot(factory);
}
