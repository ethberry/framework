import { shouldSupportsInterface } from "@gemunion/contracts-utils";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldBehaveLikeBlackList } from "@gemunion/contracts-access";

import { FrameworkInterfaceId } from "../constants";
import { deployERC721 } from "./shared/fixtures";
import { shouldMintRandom } from "./shared/random/mintRandom";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { shouldBehaveLikeERC721Blacklist, shouldBehaveLikeERC721BlacklistRandom } from "./shared/blacklist";
import { shouldMintCommon } from "./shared/simple/base/mintCommon";

describe("ERC721BlacklistRandom", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeERC721Blacklist(factory);
  shouldBehaveLikeERC721BlacklistRandom(factory);
  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    FrameworkInterfaceId.ERC721Random,
  ]);
});
