import { DEFAULT_ADMIN_ROLE, InterfaceId, MINTER_ROLE } from "@gemunion/contracts-constants";
import { shouldBehaveLikeAccessControl, shouldSupportsInterface } from "@gemunion/contracts-mocha";

import { FrameworkInterfaceId, tokenId } from "../../constants";
import { deployERC721 } from "../../ERC721/shared/fixtures";
import { shouldBehaveLikeERC721Simple } from "./shared/simple";
import { shouldBehaveLikeERC721MysteryBox } from "./shared/simple/base";
import { customMint } from "./shared/simple/customMintFn";
import { shouldBehaveLikeERC721Blacklist } from "../../ERC721/shared/blacklist";

describe("ERC721MysteryboxBlacklist", function () {
  const factory = () => deployERC721("ERC721MysteryboxBlacklist");

  shouldBehaveLikeAccessControl(factory)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBehaveLikeERC721Simple(factory, { mint: customMint, tokenId });
  shouldBehaveLikeERC721Blacklist(factory, { mint: customMint });
  shouldBehaveLikeERC721MysteryBox(factory);

  shouldSupportsInterface(factory)([
    InterfaceId.IERC165,
    InterfaceId.IAccessControl,
    InterfaceId.IERC721,
    FrameworkInterfaceId.Mystery,
  ]);
});
