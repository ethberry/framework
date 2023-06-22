import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";
import { shouldBehaveLikeERC721Burnable } from "@gemunion/contracts-erc721e";

import { tokenId } from "../../../constants";
import { customMintCommonERC721 } from "../customMintFn";
import { shouldBehaveLikeERC721 } from "./base";
import { shouldBaseUrl } from "./baseUrl";
import { shouldBehaveLikeERC721Metadata } from "./metadata";

export function shouldBehaveLikeERC721Simple(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  options = Object.assign({}, { mint: customMintCommonERC721, safeMint: customMintCommonERC721, tokenId }, options);

  shouldBehaveLikeERC721(factory, options);
  shouldBehaveLikeERC721Burnable(factory, options);
  shouldBaseUrl(factory, options);
  shouldBehaveLikeERC721Metadata(factory, options);
}
