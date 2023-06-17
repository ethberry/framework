import { batchSize, DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { shouldBehaveLikeERC721Consecutive } from "@gemunion/contracts-erc721c";

import { deployCollection } from "./shared/fixtures";
import { shouldMintConsecutive } from "./shared/simple/base/mintConsecutive";
import { shouldBehaveLikeERC721Collection } from "./shared/simple";

describe("ERC721CSimple", function () {
  const factory = () => deployCollection(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721Collection(factory);
  shouldMintConsecutive(factory);

  shouldBehaveLikeERC721Consecutive(factory, { batchSize });

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    InterfaceId.IERC721Metadata,
    InterfaceId.IRoyalty,
  ]);
});
