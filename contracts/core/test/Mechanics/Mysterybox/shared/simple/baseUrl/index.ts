import { Contract } from "ethers";

import type { IERC721EnumOptions } from "@gemunion/contracts-erc721-enumerable";

import { shouldSetBaseURI } from "./setBaseURI";
import { shouldTokenURI } from "./tokenURI";

export function shouldBaseUrl(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  shouldSetBaseURI(factory, options);
  shouldTokenURI(factory, options);
}
