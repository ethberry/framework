import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldBehaveLikeERC721Simple } from "../ERC721/shared/simple";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldMintCommon } from "../ERC721/shared/mintCommon";

describe("ERC998Simple", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721Simple(factory);
  shouldMintCommon(factory);
});
