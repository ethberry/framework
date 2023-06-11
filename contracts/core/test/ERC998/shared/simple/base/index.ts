import {
  IERC721EnumOptions,
  shouldChildContractsFor,
  shouldChildExists,
  shouldNotTransferChildToParent,
  shouldOwnerOfChild,
  shouldRootOwnerOfChild,
  shouldSafeTransferChild,
  shouldSafeTransferFrom,
  shouldTransferChild,
} from "@gemunion/contracts-erc998td";

import { customMintCommonERC721 } from "../../../../ERC721/shared/customMintFn";
import { tokenId } from "../../../../constants";

export function shouldBehaveLikeERC998(factory: () => Promise<any>, options: IERC721EnumOptions = {}) {
  options = Object.assign({}, { mint: customMintCommonERC721, safeMint: customMintCommonERC721, tokenId }, options);

  shouldSafeTransferChild(factory, options);
  shouldTransferChild(factory, options);
  shouldChildContractsFor(factory, options);
  shouldChildExists(factory, options);
  shouldSafeTransferFrom(factory, options);
  shouldOwnerOfChild(factory, options);
  shouldRootOwnerOfChild(factory);
  shouldNotTransferChildToParent(factory);
}
