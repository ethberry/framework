import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { FrameworkInterfaceId } from "../constants";
import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeUpgradeable } from "../Mechanics/Grade/upgrade";
import { shouldBehaveLikeERC998 } from "./shared/simple/base";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";

describe("ERC998UpgradeableRandom", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998Simple(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);
  shouldBehaveLikeUpgradeable(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
    FrameworkInterfaceId.ERC721Random,
    FrameworkInterfaceId.ERC721Upgradable,
  ]);
});
