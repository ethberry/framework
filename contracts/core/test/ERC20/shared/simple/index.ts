import { Contract } from "ethers";

import {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Burnable,
  shouldBehaveLikeERC20Capped,
  shouldBehaveLikeERC20Snapshot,
} from "@gemunion/contracts-erc20";

import { shouldReceive } from "./receive";

export function shouldBehaveLikeERC20Simple(factory: () => Promise<Contract>) {
  shouldBehaveLikeERC20(factory);
  shouldBehaveLikeERC20Burnable(factory);
  shouldBehaveLikeERC20Capped(factory);
  shouldBehaveLikeERC20Snapshot(factory);
  shouldReceive(factory);
}
