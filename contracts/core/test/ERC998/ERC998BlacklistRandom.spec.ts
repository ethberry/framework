import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";

import { FrameworkInterfaceId } from "../constants";
import { shouldMintCommon } from "../ERC721/shared/simple/base/mintCommon";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeERC721Blacklist, shouldBehaveLikeERC721BlacklistRandom } from "../ERC721/shared/blacklist";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";

describe("ERC998BlacklistRandom", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeERC721Blacklist(factory);
  shouldBehaveLikeERC721BlacklistRandom(factory);

  shouldBehaveLikeERC998Simple(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC998TD,
    InterfaceId.IERC998WL,
    FrameworkInterfaceId.ERC721Simple,
    FrameworkInterfaceId.ERC721Random,
  ]);
});
