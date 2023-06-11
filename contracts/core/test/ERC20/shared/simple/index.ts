import type { IERC20Options } from "@gemunion/contracts-erc20";
import {
  shouldBehaveLikeERC20,
  shouldBehaveLikeERC20Burnable,
  shouldBehaveLikeERC20Capped,
  shouldBehaveLikeERC20Snapshot,
} from "@gemunion/contracts-erc20";

import { shouldReceive } from "../../../shared/receive";

export function shouldBehaveLikeERC20Simple(factory: () => Promise<any>, options: IERC20Options = {}) {
  shouldBehaveLikeERC20(factory, options);
  shouldBehaveLikeERC20Burnable(factory, options);
  shouldBehaveLikeERC20Capped(factory);
  shouldBehaveLikeERC20Snapshot(factory, options);
  shouldReceive(factory);
}
