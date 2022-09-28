import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldMintCommon } from "./shared/mintCommon";
import { shouldMintRandom } from "./shared/random/mintRandom";
import { shouldERC721Accessible } from "./shared/accessible";
import { shouldERC721Simple } from "./shared/simple";

describe("ERC721UpgradeableRandom", function () {
  const name = "ERC721UpgradeableRandom";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);

  shouldMintCommon(name);

  shouldMintRandom(name);
});
