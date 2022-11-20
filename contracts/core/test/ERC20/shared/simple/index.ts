import { Contract } from "ethers";

import { shouldERC20Capped, shouldSnapshot, shouldERC20Base, shouldERC20Burnable } from "@gemunion/contracts-erc20";
import { shouldReceive } from "./receive";

export function shouldERC20Simple(factory: () => Promise<Contract>) {
  shouldERC20Base(factory);
  shouldERC20Burnable(factory);
  shouldERC20Capped(factory);
  shouldReceive(factory);
  shouldSnapshot(factory);
}
