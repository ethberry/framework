import { Contract } from "ethers";

import { shouldBurn } from "./burn";

export function shouldERC721Burnable(factory: () => Promise<Contract>) {
  shouldBurn(factory);
}
