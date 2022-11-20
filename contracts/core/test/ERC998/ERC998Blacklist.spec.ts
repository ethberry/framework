import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { shouldBlackList } from "@gemunion/contracts-access-list";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldERC721Simple } from "../ERC721/shared/simple";
import { deployErc721Base } from "../ERC721/shared/fixtures";
import { shouldCustomBlacklist } from "../ERC721/shared/blacklist";

describe("ERC998Blacklist", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBlackList(factory);

  shouldERC721Simple(factory);
  shouldMintCommon(factory);
  shouldCustomBlacklist(factory);
});
