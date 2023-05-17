import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldNotMint } from "../ERC721/shared/simple/base/shouldNotMint";
import { shouldNotSafeMint } from "../ERC721/shared/simple/base/shouldNotSafeMint";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { shouldNotMintCommon } from "../ERC721/shared/genes/shouldNotMintCommon";

describe("ERC998Genes", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldNotMint(factory);
  shouldNotMintCommon(factory);
  shouldNotSafeMint(factory);
  shouldMintRandom(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});
