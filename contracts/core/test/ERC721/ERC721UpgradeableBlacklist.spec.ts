import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldMintCommon } from "./shared/mintCommon";
import { shouldBlacklist } from "./shared/blacklist";
import { shouldERC721Accessible } from "./shared/accessible";
import { shouldERC721Simple } from "./shared/simple";

describe("ERC721UpgradeableBlacklist", function () {
  const name = "ERC721UpgradeableBlacklist";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);

  shouldMintCommon(name);

  shouldBlacklist(name);
});
