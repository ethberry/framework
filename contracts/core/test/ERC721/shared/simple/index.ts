import { Contract } from "ethers";

import { shouldBehaveLikeERC721 } from "./base";
// import { shouldBehaveLikeERC721Burnable } from "./burnable";
import { shouldBaseUrl } from "./baseUrl";
import { IERC721EnumOptions, shouldBehaveLikeERC721Burnable } from "@gemunion/contracts-erc721-enumerable";
import { customMintCommonERC721 } from "../customMintFn";
import { tokenId } from "../../../constants";

export function shouldBehaveLikeERC721Simple(factory: () => Promise<Contract>, options: IERC721EnumOptions = {}) {
  Object.assign(options, { mint: customMintCommonERC721, safeMint: customMintCommonERC721, tokenId }, options);

  shouldBehaveLikeERC721(factory, options);
  shouldBehaveLikeERC721Burnable(factory, options);
  shouldBaseUrl(factory);
  // shouldReceive(factory); // have in shouldBehaveLikeERC721 - revertETH
}
