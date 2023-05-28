import { Contract } from "ethers";

import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";
import { shouldBehaveLikeERC721Burnable } from "@gemunion/contracts-erc721e";

import { tokenId } from "../../../constants";
import { shouldBehaveLikeERC721 } from "./base";
import { shouldBaseUrl } from "./baseUrl";
import { customMintCommonERC721 } from "../customMintFn";

export function shouldBehaveLikeERC721Simple(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  Object.assign(options, { mint: customMintCommonERC721, safeMint: customMintCommonERC721, tokenId }, options);

  shouldBehaveLikeERC721(factory, options);
  shouldBehaveLikeERC721Burnable(factory, options);
  shouldBaseUrl(factory);
}
