import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeBlackList } from "@gemunion/contracts-access-list";

import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { shouldBehaveLikeERC721Simple } from "../ERC721/shared/simple";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeERC721Blacklist } from "../ERC721/shared/blacklist";

describe("ERC998RandomBlacklist", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldBehaveLikeBlackList(factory);

  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);
  shouldMintRandom(factory);
  shouldBehaveLikeERC721Blacklist(factory);
});
