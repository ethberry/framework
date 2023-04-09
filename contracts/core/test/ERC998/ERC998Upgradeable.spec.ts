import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldBehaveLikeUpgradeable } from "../Mechanics/Grade/upgrade";

describe("ERC998Upgradeable", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);

  shouldBehaveLikeERC998Simple(factory);
  shouldMintCommon(factory);
  shouldBehaveLikeUpgradeable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
  );
});
