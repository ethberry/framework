import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { batchSize, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";
import { shouldBehaveLikeERC721Consecutive } from "@gemunion/contracts-erc721c";

import { deployCollection } from "./shared/fixtures";
import { shouldMintConsecutive } from "./shared/simple/base/mintConsecutive";
import { shouldBehaveLikeERC721Collection } from "./shared/simple";

describe("ERC721CBlacklist", function () {
  // test timeout fails when batchSize = 5000n
  const overrideBatchSize = process.env.NODE_ENV === "test" ? 10n : batchSize;
  const factory = () => deployCollection(this.title, overrideBatchSize);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeBlackList(factory);

  shouldBehaveLikeERC721Collection(factory);
  shouldMintConsecutive(factory);

  shouldBehaveLikeERC721Consecutive(factory, { batchSize: overrideBatchSize });

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});
