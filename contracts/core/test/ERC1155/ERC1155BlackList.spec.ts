import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldERC1155Accessible } from "./shared/accessible";
import { shouldBlacklist } from "./shared/blacklist";

describe("ERC1155Blacklist", function () {
  const name = "ERC1155Blacklist";

  shouldERC1155Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);

  shouldBlacklist(name);
});
