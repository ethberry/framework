import { shouldSupportsInterface } from "@gemunion/contracts-utils";
import { shouldBehaveLikeAccessControl, shouldBehaveLikeBlackList } from "@gemunion/contracts-access";
import { DEFAULT_ADMIN_ROLE, InterfaceId, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { FrameworkInterfaceId } from "../constants";
import { shouldBehaveLikeDiscrete } from "../Mechanics/Grade/upgrade";
import { deployERC721 } from "./shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { shouldMintRandom } from "./shared/random/mintRandom";
import { shouldBehaveLikeERC721Blacklist, shouldBehaveLikeERC721BlacklistRandom } from "./shared/blacklist";
import { shouldMintCommon } from "./shared/simple/base/mintCommon";

describe("ERC721BlacklistDiscreteRandom", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);
  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeERC721Blacklist(factory);
  shouldBehaveLikeERC721BlacklistRandom(factory);
  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);
  shouldBehaveLikeDiscrete(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
    FrameworkInterfaceId.ERC721Upgradable,
    FrameworkInterfaceId.ERC721Random,
  ]);
});
