import { shouldBehaveLikeAccessControl } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { deployERC721 } from "../ERC721/shared/fixtures";

describe("ERC998ERC1155ERC20Simple", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC998Simple(factory);
  shouldMintCommon(factory);
});
