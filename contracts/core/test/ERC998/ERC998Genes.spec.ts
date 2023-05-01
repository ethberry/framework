import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMint } from "../ERC721/shared/simple/base/mint";
import { shouldSafeMint } from "../ERC721/shared/simple/base/safeMint";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { shouldNotMintCommon } from "../ERC721/shared/shouldNotMintCommon";

describe("ERC998Genes", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldMint(factory);
  shouldNotMintCommon(factory);
  shouldMintRandom(factory);
  shouldSafeMint(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});
