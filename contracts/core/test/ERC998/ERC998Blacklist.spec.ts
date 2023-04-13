import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeERC721BlackList } from "../ERC721/shared/blacklist";
import { shouldBehaveLikeERC998 } from "./shared/simple/base";

describe("ERC998Blacklist", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeERC721BlackList(factory);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998Simple(factory);
  shouldMintCommon(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721);
});
