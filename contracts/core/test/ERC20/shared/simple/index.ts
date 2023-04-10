import { Contract } from "ethers";
import { MINTER_ROLE } from "@gemunion/contracts-constants";

import {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Burnable,
  shouldBehaveLikeERC20Capped,
  shouldBehaveLikeERC20Snapshot,
  shouldMint,
  shouldBalanceOf,
  shouldApprove,
} from "@gemunion/contracts-erc20";

import { shouldReceive } from "./receive";

export function shouldBehaveLikeERC20Simple(factory: () => Promise<Contract>) {
  shouldBehaveLikeERC20(factory, { minterRole: MINTER_ROLE });
  shouldBehaveLikeERC20Burnable(factory);
  shouldBehaveLikeERC20Capped(factory);
  shouldBehaveLikeERC20Snapshot(factory);
  shouldReceive(factory);
}

export function shouldBehaveLikeERC20WithoutTransfer(factory: () => Promise<Contract>) {
  shouldMint(factory, { minterRole: MINTER_ROLE });
  shouldBalanceOf(factory);
  // shouldTransfer(factory);
  // shouldTransferFrom(factory);
  shouldApprove(factory);

  shouldBehaveLikeERC20Burnable(factory);
  shouldBehaveLikeERC20Capped(factory);
  shouldBehaveLikeERC20Snapshot(factory);
  shouldReceive(factory);
}
