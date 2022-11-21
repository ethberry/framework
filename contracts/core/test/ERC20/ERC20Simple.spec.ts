import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";

import { shouldBehaveLikeERC20Simple } from "./shared/simple";
import { deployERC20 } from "./shared/fixtures";

describe("ERC20Simple", function () {
  const factory = () => deployERC20(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);

  shouldBehaveLikeERC20Simple(factory);
});
