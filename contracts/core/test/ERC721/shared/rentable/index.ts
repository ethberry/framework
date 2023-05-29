import { Contract } from "ethers";

import { shouldSetUser } from "./setUser";
import { IERC721EnumOptions, shouldUserExprires, shouldUserOf } from "@gemunion/contracts-erc721e";
import { customMintCommonERC721 } from "../customMintFn";

export function shouldBehaveLikeERC721Rentable(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  options = Object.assign({}, { mint: customMintCommonERC721, tokenId: 1 }, options);

  shouldSetUser(factory, options);
  shouldUserOf(factory, options);
  shouldUserExprires(factory, options);
}
