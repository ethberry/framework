import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldMintRandom } from "../ERC721/shared/random/mintRandom";
import { shouldERC721Accessible } from "../ERC721/shared/accessible";
import { shouldERC721Simple } from "../ERC721/shared/simple";

describe("ERC998UpgradeableRandom", function () {
  const name = "ERC998UpgradeableRandom";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);

  shouldMintCommon(name);
  shouldMintRandom(name);
});
