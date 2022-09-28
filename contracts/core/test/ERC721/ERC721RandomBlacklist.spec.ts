import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldMintCommon } from "./shared/mintCommon";
import { shouldBlacklist } from "./shared/blacklist";
import { shouldMintRandom } from "./shared/random/mintRandom";
import { shouldERC721Accessible } from "./shared/accessible";
import { shouldERC721Simple } from "./shared/simple";

describe("ERC721RandomBlacklist", function () {
  const name = "ERC721RandomBlacklist";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);

  shouldMintCommon(name);
  shouldMintRandom(name);

  shouldBlacklist(name);
});
