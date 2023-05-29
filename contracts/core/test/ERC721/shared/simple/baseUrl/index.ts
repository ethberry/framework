import { Contract } from "ethers";

import { shouldSetBaseURI } from "./setBaseURI";
import { shouldTokenURI } from "./tokenURI";
import { IERC721EnumOptions } from "@gemunion/contracts-erc721-enumerable";

export function shouldBaseUrl(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  shouldSetBaseURI(factory, options);
  shouldTokenURI(factory, options);
}
