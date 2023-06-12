import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldNotMintCommon } from "../ERC721/shared/shouldNotMintCommon";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { shouldNotMint } from "../ERC721/shared/simple/base/shouldNotMint";
import { shouldNotSafeMint } from "../ERC721/shared/simple/base/shouldNotSafeMint";
import { FrameworkInterfaceId } from "../constants";

describe("ERC998Genes", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldNotMint(factory);
  shouldNotMintCommon(factory);
  shouldNotSafeMint(factory);
  shouldMintRandom(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    FrameworkInterfaceId.ERC721Random,
  ]);
});
