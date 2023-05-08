import { Contract } from "ethers";

import {
  IERC721EnumOptions,
  shouldApprove,
  shouldGetBalanceOf,
  shouldGetOwnerOf,
  shouldSafeMint,
  shouldSafeTransferFrom,
  shouldSetApprovalForAll,
  shouldTransferFrom,
} from "@gemunion/contracts-erc721-enumerable";

import { shouldReceive } from "../../../../shared/receive";
import { shouldNotMint } from "./shouldNotMint";
import { shouldNotSafeMint } from "./shouldNotSafeMint";

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
  shouldReceive(factory);
}
