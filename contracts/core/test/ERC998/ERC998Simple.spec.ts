import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldHaveRole } from "../ERC721/shared/accessControl/hasRoles";
import { shouldGetTokenURI } from "../ERC721/shared/common/tokenURI";
import { shouldSetBaseURI } from "../ERC721/shared/common/setBaseURI";
import { shouldMint } from "../ERC721/shared/mint";
import { shouldSafeMint } from "../ERC721/shared/safeMint";
import { shouldMintCommon } from "../ERC721/shared/common/mintCommon";
import { shouldApprove } from "../ERC721/shared/common/approve";
import { shouldGetBalanceOf } from "../ERC721/shared/common/balanceOf";
import { shouldBurn } from "../ERC721/shared/common/burn";
import { shouldGetOwnerOf } from "../ERC721/shared/common/ownerOf";
import { shouldSetApprovalForAll } from "../ERC721/shared/common/setApprovalForAll";
import { shouldTransferFrom } from "../ERC721/shared/common/transferFrom";
import { shouldSafeTransferFrom } from "../ERC721/shared/common/safeTransferFrom";

describe("ERC998Simple", function () {
  const name = "ERC998Simple";

  shouldHaveRole(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldMintCommon(name);
  shouldMint(name);
  shouldSafeMint(name);
  shouldApprove(name);
  shouldGetBalanceOf(name);
  shouldBurn(name);
  shouldGetOwnerOf(name);
  shouldSetApprovalForAll(name);
  shouldTransferFrom(name);
  shouldSafeTransferFrom(name);
  shouldGetTokenURI(name);
  shouldSetBaseURI(name);
});
