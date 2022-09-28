import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldERC721Accessible } from "./shared/accessible";
import { shouldERC721Simple } from "./shared/simple";

describe("ERC721Simple", function () {
  const name = "ERC721Simple";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);
});
