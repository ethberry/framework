import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC721 } from "./shared/fixtures";
import { shouldMint } from "./shared/simple/base/mint";
import { shouldSafeMint } from "./shared/simple/base/safeMint";
import { shouldMintRandom } from "./shared/random/mintRandom";
import { shouldNotMintCommon } from "./shared/mintCommonFail";

describe("ERC721Genes", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldMint(factory);
  shouldNotMintCommon(factory);
  shouldMintRandom(factory);
  shouldSafeMint(factory);

  shouldSupportsInterface(factory)(InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721);
});
