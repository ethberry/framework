import { shouldBehaveLikeOwnable } from "@gemunion/contracts-mocha";

import { deployVesting } from "./shared/fixture";
import { shouldBehaveLikeTopUp } from "../../shared/topUp";

describe("Vesting TopUp", function () {
  const factory = () => deployVesting("LinearVesting");

  shouldBehaveLikeOwnable(factory);
  shouldBehaveLikeTopUp(factory);
});
