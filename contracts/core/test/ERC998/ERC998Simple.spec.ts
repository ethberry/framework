import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldERC721Simple } from "../ERC721/shared/simple";
import { deployErc721Base } from "../ERC721/shared/fixtures";
import { shouldMintCommon } from "../ERC721/shared/mintCommon";

describe("ERC998Simple", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldERC721Simple(factory);
  shouldMintCommon(factory);
});
