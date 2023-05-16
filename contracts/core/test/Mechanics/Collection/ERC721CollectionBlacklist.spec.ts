import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE, batchSize } from "@gemunion/contracts-constants";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";

import { deployERC721 } from "./shared/fixtures";
import { shouldMintCommon } from "./shared/mintCommon";
import { shouldBehaveLikeERC721 } from "./shared/simple/base";
import { shouldBehaveLikeERC721Consecutive } from "@gemunion/contracts-erc721";

describe("ERC721CollectionBlacklist", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeBlackList(factory);

  shouldBehaveLikeERC721(factory);
  shouldMintCommon(factory);

  shouldBehaveLikeERC721Consecutive(factory, { batchSize });

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});
