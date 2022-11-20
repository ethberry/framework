import { shouldBeAccessible } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "@gemunion/contracts-constants";
import { shouldBlackList } from "@gemunion/contracts-access-list";

import { deployErc20Base } from "./shared/fixtures";
import { shouldSimple } from "./shared/simple";
import { shouldCustomBlackList } from "./shared/blacklist";

describe("ERC20Blacklist", function () {
  const factory = () => deployErc20Base(this.title);

  shouldBeAccessible(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldBlackList(factory);

  shouldSimple(factory);
  shouldCustomBlackList(factory);
});
