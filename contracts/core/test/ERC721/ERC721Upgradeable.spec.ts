import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeERC721Metadata } from "@gemunion/contracts-erc721-enumerable";

import { shouldMintCommon } from "./shared/mintCommon";
import { deployERC721 } from "./shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";

describe("ERC721Upgradeable", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeERC721Metadata(factory);

  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
  );
});
