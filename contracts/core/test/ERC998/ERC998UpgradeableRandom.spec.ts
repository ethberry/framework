import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeUpgradeable } from "../Mechanics/Grade/upgrade";

describe("ERC998UpgradeableRandom", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);

  shouldBehaveLikeERC998Simple(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);
  shouldBehaveLikeUpgradeable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
  );
});
