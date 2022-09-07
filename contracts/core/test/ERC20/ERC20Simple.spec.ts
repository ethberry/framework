import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "../constants";
import { shouldRevokeRole } from "./shared/accessControl/revokeRole";
import { shouldGrantRole } from "./shared/accessControl/grantRole";
import { shouldGetRoleAdmin } from "./shared/accessControl/getRoleAdmin";
import { shouldHaveRole } from "./shared/accessControl/hasRoles";
import { shouldRenounceRole } from "./shared/accessControl/renounceRole";
import { shouldMint } from "./shared/mint";
import { shouldBalanceOf } from "./shared/balanceOf";
import { shouldTransfer } from "./shared/transfer";
import { shouldTransferFrom } from "./shared/transferFrom";
import { shouldSnapshot } from "./shared/snapshot";
import { shouldApprove } from "./shared/approve";
import { shouldBurn } from "./shared/burn";
import { shouldBurnFrom } from "./shared/burnFrom";
import { shouldCap } from "./shared/cap";
import { shouldReceive } from "./shared/receive";

describe("ERC20Simple", function () {
  const name = "ERC20Simple";

  shouldHaveRole(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldGetRoleAdmin(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldGrantRole(name);
  shouldRevokeRole(name);
  shouldRenounceRole(name);

  shouldMint(name);
  shouldBalanceOf(name);
  shouldTransfer(name);
  shouldTransferFrom(name);
  shouldSnapshot(name);
  shouldApprove(name);
  shouldBurn(name);
  shouldBurnFrom(name);
  shouldCap(name);
  shouldReceive(name);
});
