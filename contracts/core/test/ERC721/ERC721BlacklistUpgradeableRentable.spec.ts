import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";
import { DEFAULT_ADMIN_ROLE, InterfaceId, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "./shared/mintCommon";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { deployERC721 } from "./shared/fixtures";
import { shouldBehaveLikeUpgradeable } from "../Mechanics/Grade/upgrade";
import { FrameworkInterfaceId } from "../constants";
import { shouldBehaveLikeERC721Blacklist } from "./shared/blacklist";
import { shouldBehaveLikeERC721Rentable } from "./shared/user";

describe("ERC721BlacklistUpgradeableRentable", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);
  shouldBehaveLikeBlackList(factory);
  shouldBehaveLikeERC721Blacklist(factory);

  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);
  shouldBehaveLikeUpgradeable(factory);

  shouldBehaveLikeERC721Rentable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
    InterfaceId.IERC4907,
    FrameworkInterfaceId.ERC721Upgradable,
  );
});
