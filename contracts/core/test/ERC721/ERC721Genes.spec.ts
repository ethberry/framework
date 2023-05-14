import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC721 } from "./shared/fixtures";
import { shouldNotMint } from "./shared/simple/base/shouldNotMint";
import { shouldNotSafeMint } from "./shared/simple/base/shouldNotSafeMint";
import { shouldNotMintCommon } from "./shared/genes/shouldNotMintCommon";
import { shouldMintRandom } from "./shared/random/mintRandom";

describe("ERC721Genes", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldNotMint(factory);
  shouldNotMintCommon(factory);
  shouldMintRandom(factory);
  shouldNotSafeMint(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});
