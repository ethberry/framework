import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";
import { DEFAULT_ADMIN_ROLE, InterfaceId, METADATA_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { shouldBehaveLikeUpgradeable } from "../Mechanics/Grade/upgrade";
import { interfaceId } from "../constants";

describe("ERC998BlacklistUpgradeable", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, METADATA_ROLE);
  shouldBehaveLikeBlackList(factory);

  shouldBehaveLikeERC998Simple(factory);
  shouldMintCommon(factory);
  shouldBehaveLikeUpgradeable(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC4906,
    interfaceId.Grade,
  );
});
