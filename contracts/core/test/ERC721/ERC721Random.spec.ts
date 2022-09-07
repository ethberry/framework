import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";

import { shouldHaveRole } from "./shared/accessControl/hasRoles";
import { shouldGetRoleAdmin } from "./shared/accessControl/getRoleAdmin";
import { shouldGrantRole } from "./shared/accessControl/grantRole";
import { shouldRevokeRole } from "./shared/accessControl/revokeRole";
import { shouldRenounceRole } from "./shared/accessControl/renounceRole";

import { shouldGetTokenURI } from "./shared/common/tokenURI";
import { shouldSetBaseURI } from "./shared/common/setBaseURI";
import { shouldMintCommon } from "./shared/common/mintCommon";
import { shouldMint } from "./shared/mint";
import { shouldSafeMint } from "./shared/safeMint";
import { shouldApprove } from "./shared/common/approve";
import { shouldGetBalanceOf } from "./shared/common/balanceOf";
import { shouldBurn } from "./shared/common/burn";
import { shouldGetOwnerOf } from "./shared/common/ownerOf";
import { shouldSetApprovalForAll } from "./shared/common/setApprovalForAll";
import { shouldTransferFrom } from "./shared/common/transferFrom";
import { shouldSafeTransferFrom } from "./shared/common/safeTransferFrom";
import { shouldMintRandom } from "./shared/random/mintRandom";

describe("ERC721Random", function () {
  const name = "ERC721Random";

  shouldHaveRole(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGetRoleAdmin(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldGrantRole(name);
  shouldRevokeRole(name);
  shouldRenounceRole(name);

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

  shouldMintRandom(name);
});
