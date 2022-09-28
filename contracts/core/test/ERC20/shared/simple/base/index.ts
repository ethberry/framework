import { shouldMint } from "./mint";
import { shouldBalanceOf } from "./balanceOf";
import { shouldTransfer } from "./transfer";
import { shouldTransferFrom } from "./transferFrom";
import { shouldApprove } from "./approve";

export function shouldERC20Base(name: string) {
  shouldApprove(name);
  shouldBalanceOf(name);
  shouldMint(name);
  shouldTransfer(name);
  shouldTransferFrom(name);
}
