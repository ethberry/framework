import { shouldBalanceOf } from "./balanceOf";
import { shouldTransferFrom } from "./transferFrom";
import { shouldApprove } from "./approve";
import { shouldOwnerOf } from "./ownerOf";
import { shouldSafeTransferFrom } from "./safeTransferFrom";
import { shouldSetApprovalForAll } from "./setApprovalForAll";
import { shouldMint } from "./mint";
import { shouldSafeMint } from "./safeMint";

export function shouldERC721Base(name: string) {
  shouldApprove(name);
  shouldBalanceOf(name);
  shouldOwnerOf(name);
  shouldSetApprovalForAll(name);
  shouldTransferFrom(name);
  shouldSafeTransferFrom(name);

  shouldMint(name);
  shouldSafeMint(name);
}
