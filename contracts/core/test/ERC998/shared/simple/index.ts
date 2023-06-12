import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";
import { shouldBehaveLikeERC998WhiteListChild } from "@gemunion/contracts-erc998td";

import { tokenId } from "../../../constants";
import { shouldBehaveLikeERC721Simple } from "../../../ERC721/shared/simple";
import { customMintCommonERC721 } from "../../../ERC721/shared/customMintFn";
import { shouldBehaveLikeERC998 } from "./base";

export function shouldBehaveLikeERC998Simple(factory: () => Promise<any>, options?: IERC721EnumOptions) {
  options = Object.assign({}, { mint: customMintCommonERC721, safeMint: customMintCommonERC721, tokenId }, options);

  shouldBehaveLikeERC721Simple(factory, options);
  shouldBehaveLikeERC998(factory, options);
  shouldBehaveLikeERC998WhiteListChild(factory, options);
}
