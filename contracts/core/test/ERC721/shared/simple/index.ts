import { Contract } from "ethers";

import { shouldERC721Base } from "./base";
import { shouldERC721Burnable } from "./burnable";
import { shouldBaseUrl } from "./baseUrl";

export function shouldERC721Simple(factory: () => Promise<Contract>) {
  shouldERC721Base(factory);
  shouldERC721Burnable(factory);
  shouldBaseUrl(factory);
}
