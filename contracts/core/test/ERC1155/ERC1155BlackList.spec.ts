import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC1155 } from "./shared/fixtures";
import { shouldBehaveLikeERC1155BlackList } from "./shared/blacklist/blacklist";
import { shouldBehaveLikeERC1155Simple } from "./shared/simple";

describe("ERC1155Blacklist", function () {
  const factory = () => deployERC1155(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC1155Simple(factory);
  shouldBehaveLikeERC1155BlackList(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC1155]);
});
