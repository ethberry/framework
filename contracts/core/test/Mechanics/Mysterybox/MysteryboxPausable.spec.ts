import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { shouldBehaveLikeERC721Pausable } from "@gemunion/contracts-erc721-enumerable";

import { FrameworkInterfaceId, tokenId } from "../../constants";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { shouldBehaveLikeTopUp } from "../../shared/topUp";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { shouldBehaveLikeERC721MysteryBox } from "./shared/simple/base";
import { customMint } from "./shared/simple/customMintFn";

describe("ERC721MysteryboxPausable", function () {
  const factory = () => deployERC721("ERC721MysteryboxPausable");

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721Simple(factory, { mint: customMint, tokenId });
  shouldBehaveLikeERC721Pausable(factory, { mint: customMint });
  shouldBehaveLikeERC721MysteryBox(factory);
  shouldBehaveLikeTopUp(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    FrameworkInterfaceId.ERC721Mystery,
  ]);
});
