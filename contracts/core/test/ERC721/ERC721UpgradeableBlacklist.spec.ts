import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { shouldBlackList } from "@gemunion/contracts-access-list";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "./shared/mintCommon";
import { shouldERC721Simple } from "./shared/simple";
import { deployErc721Base } from "./shared/fixtures";
import { shouldCustomBlacklist } from "./shared/blacklist";

describe("ERC721UpgradeableBlacklist", function () {
  const factory = () => deployErc721Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBlackList(factory);

  shouldERC721Simple(factory);
  shouldMintCommon(factory);
  shouldCustomBlacklist(factory);
});
