import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";

import { shouldERC20Simple } from "./shared/simple";
import { deployErc20Base } from "./shared/fixtures";

describe("ERC20Simple", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldERC20Simple(factory);
});
