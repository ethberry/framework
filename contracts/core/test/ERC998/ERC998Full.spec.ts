import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldBlacklist } from "../ERC721/shared/blacklist";
import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldERC721Accessible } from "../ERC721/shared/accessible";
import { shouldERC721Simple } from "../ERC721/shared/simple";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";

describe("ERC998Full", function () {
  const name = "ERC998Full";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);

  shouldMintCommon(name);
  shouldMintRandom(name);

  shouldBlacklist(name);
});
