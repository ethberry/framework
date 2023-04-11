import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";

import { shouldMintCommon } from "./shared/mintCommon";

import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { deployERC721 } from "./shared/fixtures";
import { shouldBehaveLikeERC721BlackList } from "./shared/blacklist";

describe("ERC721Blacklist", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeERC721BlackList(factory);

  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721);
});
