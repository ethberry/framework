import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import {
  shouldBehaveLikeERC998ERC1155,
  shouldBehaveLikeERC998ERC1155Enumerable,
  shouldBehaveLikeERC998ERC20,
  shouldBehaveLikeERC998ERC20Enumerable,
  shouldStateHash,
} from "@gemunion/contracts-erc998td";

import { shouldMintCommon } from "../ERC721/shared/simple/base/mintCommon";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeERC998 } from "./shared/simple/base";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { customMintCommonERC721 } from "../ERC721/shared/customMintFn";
import { tokenId } from "../constants";

describe("ERC998ERC1155ERC20StateHashSimpleEnum", function () {
  const factory = () => deployERC721(this.title);

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998Simple(factory);
  shouldMintCommon(factory);
  shouldBehaveLikeERC998ERC20(factory, { mint: customMintCommonERC721, tokenId });
  shouldBehaveLikeERC998ERC20Enumerable(factory, { mint: customMintCommonERC721, tokenId });
  shouldBehaveLikeERC998ERC1155(factory, { mint: customMintCommonERC721, tokenId });
  shouldBehaveLikeERC998ERC1155Enumerable(factory, { mint: customMintCommonERC721, tokenId });
  shouldStateHash(factory, { mint: customMintCommonERC721, tokenId });

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});
