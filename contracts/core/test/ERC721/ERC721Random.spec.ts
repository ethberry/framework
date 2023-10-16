import { shouldSupportsInterface } from "@gemunion/contracts-utils";
import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-access";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { FrameworkInterfaceId } from "../constants";
import { deployERC721 } from "./shared/fixtures";
import { shouldMintRandom } from "./shared/random/mintRandom";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { shouldMintCommon } from "./shared/simple/base/mintCommon";

describe("ERC721Random", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
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
