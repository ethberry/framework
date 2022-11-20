import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBlackList } from "@gemunion/contracts-access-list";

import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { shouldERC721Simple } from "../ERC721/shared/simple";
import { deployErc721Base } from "../ERC721/shared/fixtures";
import { shouldCustomBlacklist } from "../ERC721/shared/blacklist";

describe("ERC998RandomBlacklist", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBlackList(factory);

  shouldERC721Simple(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);
  shouldCustomBlacklist(factory);
});
