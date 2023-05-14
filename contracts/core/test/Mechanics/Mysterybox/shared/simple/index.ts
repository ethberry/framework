import { Contract } from "ethers";

import {
  shouldGetOwnerOf,
  shouldApprove,
  shouldSetApprovalForAll,
  shouldGetBalanceOf,
  shouldTransferFrom,
  shouldSafeTransferFrom,
  shouldBehaveLikeERC721Burnable,
} from "@gemunion/contracts-erc721-enumerable";
import type { IERC721EnumOptions } from "@gemunion/contracts-erc721-enumerable";

import { shouldNotMint } from "../../../../ERC721/shared/simple/base/shouldNotMint";
import { shouldNotSafeMint } from "../../../../ERC721/shared/simple/base/shouldNotSafeMint";
import { shouldBaseUrl } from "./baseUrl";
import { shouldReceive } from "../../../../shared/receive";

export function shouldBehaveLikeERC721(factory: () => Promise<Contract>, options?: IERC721EnumOptions) {
  shouldNotMint(factory);
  shouldNotSafeMint(factory);
  shouldGetOwnerOf(factory, options);
  shouldApprove(factory, options);
  shouldSetApprovalForAll(factory, options);
  shouldGetBalanceOf(factory, options);
  shouldTransferFrom(factory, options);
  shouldSafeTransferFrom(factory, options);
}

export function shouldBehaveLikeERC721Simple(factory: () => Promise<Contract>, options?: IERC721EnumOptions) {
  shouldBehaveLikeERC721(factory, options);
  shouldBehaveLikeERC721Burnable(factory, options);
  shouldBaseUrl(factory, options);
  shouldReceive(factory);
}
