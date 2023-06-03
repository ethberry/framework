import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";

import { deployERC1363 } from "./shared/fixtures";
import { shouldBehaveLikeERC20Simple } from "./shared/simple";
import { shouldBehaveLikeERC20BlackList } from "./shared/blacklist";

describe("ERC20Blacklist", function () {
  const factory = () => deployERC1363(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeERC20BlackList(factory);

  shouldBehaveLikeERC20Simple(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC20,
    InterfaceId.IERC1363,
  ]);
});
