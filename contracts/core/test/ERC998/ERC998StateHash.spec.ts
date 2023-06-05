import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeERC998 } from "./shared/simple/base";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { shouldStateHash } from "@gemunion/contracts-erc998td";
import { customMintCommonERC721 } from "../ERC721/shared/customMintFn";
import { tokenId } from "../constants";

describe("ERC998StateHash", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998Simple(factory);
  shouldStateHash(factory, { mint: customMintCommonERC721, tokenId });

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});
