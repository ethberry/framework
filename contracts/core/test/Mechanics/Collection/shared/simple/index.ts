import type { IERC721EnumOptions } from "@gemunion/contracts-erc721e";
import { shouldBehaveLikeERC721Burnable } from "@gemunion/contracts-erc721e";
import { batchSize } from "@gemunion/contracts-constants";

import { shouldBehaveLikeERC721 } from "./base";
import { shouldBaseUrl } from "../../../../ERC721/shared/simple/baseUrl";
import { customMintConsecutive } from "../customMintFn";
import { tokenId } from "../../../../constants";

export function shouldBehaveLikeERC721Collection(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  options = Object.assign(
    {},
    {
      mint: customMintConsecutive(options.batchSize),
      safeMint: customMintConsecutive(options.batchSize),
      tokenId,
      batchSize,
    },
    options,
  );

  shouldBehaveLikeERC721(factory, options);
  shouldBehaveLikeERC721Burnable(factory, options);
  shouldBaseUrl(factory, options);
}
