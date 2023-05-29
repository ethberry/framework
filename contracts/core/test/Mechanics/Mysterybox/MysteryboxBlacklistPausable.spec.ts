import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";
import { shouldBehaveLikeERC721Pausable } from "@gemunion/contracts-erc721e";

import { FrameworkInterfaceId, tokenId } from "../../constants";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { shouldBehaveLikeERC721MysteryBox } from "./shared/simple/base";
import { shouldBehaveLikeTopUp } from "../../shared/topUp";
import { customMint } from "./shared/simple/customMintFn";
import { shouldBehaveLikeERC721Blacklist } from "../../ERC721/shared/blacklist";

describe("ERC721MysteryboxBlacklistPausable", function () {
  const factory = () => deployERC721("ERC721MysteryboxBlacklistPausable");

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721Simple(factory, { mint: customMint, tokenId });
  shouldBehaveLikeERC721Blacklist(factory, { mint: customMint });
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
