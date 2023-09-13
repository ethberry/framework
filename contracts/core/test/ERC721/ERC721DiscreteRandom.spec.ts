import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { FrameworkInterfaceId } from "../constants";
import { shouldBehaveLikeDiscrete } from "../Mechanics/Grade/upgrade";
import { deployERC721 } from "./shared/fixtures";
import { shouldMintRandom } from "./shared/random/mintRandom";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { shouldMintCommon } from "./shared/simple/base/mintCommon";

describe("ERC721DiscreteRandom", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);
  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);
  shouldBehaveLikeDiscrete(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
    FrameworkInterfaceId.ERC721Random,
    FrameworkInterfaceId.ERC721Upgradable,
  ]);
});
