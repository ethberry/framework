import { shouldBehaveLikeOwnable, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { InterfaceId } from "@gemunion/contracts-constants";

import { deployVesting } from "./shared/fixture";
import { shouldBehaveLikeTopUp } from "../../shared/topUp";

describe("Vesting TopUp", function () {
  const factory = () => deployVesting("LinearVesting");

  shouldBehaveLikeOwnable(factory);
  shouldBehaveLikeTopUp(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IERC1363Receiver, InterfaceId.IERC1363Spender]);
});
