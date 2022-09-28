import { DEFAULT_ADMIN_ROLE, MINTER_ROLE } from "../constants";
import { shouldMintCommon } from "../ERC721/shared/mintCommon";
import { shouldBlacklist } from "../ERC721/shared/blacklist";
import { shouldERC721Accessible } from "../ERC721/shared/accessible";
import { shouldERC721Simple } from "../ERC721/shared/simple";

describe("ERC998Blacklist", function () {
  const name = "ERC998Blacklist";

  shouldERC721Accessible(name)(DEFAULT_ADMIN_ROLE, MINTER_ROLE);
  shouldERC721Simple(name);

  shouldMintCommon(name);

  shouldBlacklist(name);
});
