import { DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE } from "../constants";
import { shouldERC20Accessible } from "./shared/accessible";
import { shouldERC20Simple } from "./shared/simple";

describe("ERC20Simple", function () {
  const name = "ERC20Simple";

  shouldERC20Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE, SNAPSHOT_ROLE);
  shouldERC20Simple(name);
});
