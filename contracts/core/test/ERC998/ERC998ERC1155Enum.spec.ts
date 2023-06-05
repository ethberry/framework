import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";

import { shouldMintCommon } from "../ERC721/shared/simple/base/mintCommon";
import { deployERC721 } from "../ERC721/shared/fixtures";
import { shouldBehaveLikeERC998 } from "./shared/simple/base";
import { shouldBehaveLikeERC998Simple } from "./shared/simple";
import { shouldBehaveLikeERC998ERC1155, shouldBehaveLikeERC998ERC1155Enumerable } from "@gemunion/contracts-erc998td";
import { customMintCommonERC721 } from "../ERC721/shared/customMintFn";
import { tokenId } from "../constants";

describe("ERC998ERC1155Enum", function () {
  const factory = () => deployERC721(this.title);
  const options = { mint: customMintCommonERC721, tokenId };

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC998(factory);
  shouldBehaveLikeERC998ERC1155Enumerable(factory, options);
  shouldBehaveLikeERC998Simple(factory);
  shouldBehaveLikeERC998ERC1155(factory, options);
  shouldBehaveLikeERC998ERC1155Enumerable(factory, options);
  shouldMintCommon(factory);

  shouldSupportsInterface(factory)([InterfaceId.IERC165, InterfaceId.IAccessControl, InterfaceId.IERC721]);
});
