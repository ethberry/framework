import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldBlacklist } from "./shared/blacklist";
import { shouldMintCommon } from "./shared/mintCommon";
import { shouldERC721Accessible } from "./shared/accessible";
import { shouldERC721Simple } from "./shared/simple";

describe("ERC721Full", function () {
  const name = "ERC721Full";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);

  shouldMintCommon(name);

  shouldBlacklist(name);
});
