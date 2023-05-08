import { Contract } from "ethers";

import {
  shouldApprove,
  shouldGetBalanceOf,
  shouldGetOwnerOf,
  shouldSetApprovalForAll,
  shouldTransferFrom,
  shouldSafeTransferFrom,
  shouldSafeMint,
  IERC721EnumOptions,
} from "@gemunion/contracts-erc721-enumerable";

import { shouldNotMint } from "./shouldNotMint";
import { shouldNotSafeMint } from "./shouldNotSafeMint";
import { shouldRevertETH } from "./revertETH";

export function shouldBehaveLikeERC721(factory: () => Promise<Contract>, options?: IERC721EnumOptions) {
  shouldApprove(factory, options);
  shouldGetBalanceOf(factory, options);
  shouldGetOwnerOf(factory, options);
  shouldSetApprovalForAll(factory, options);
  shouldTransferFrom(factory, options);
  shouldSafeTransferFrom(factory, options);
  shouldSafeMint(factory, options);

  shouldNotMint(factory);
  shouldNotSafeMint(factory);
  shouldRevertETH(factory);
}
