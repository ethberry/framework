import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "./shared/mintCommon";
import { shouldMintRandom } from "./shared/random/mintRandom";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { deployERC721 } from "./shared/fixtures";
import { interfaceId } from "../constants";

describe("ERC721Random", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeERC721Simple(factory);

  shouldMintCommon(factory);
  shouldMintRandom(factory);

  shouldSupportsInterface(factory)(
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    interfaceId.ERC721Randmon,
  );
});
