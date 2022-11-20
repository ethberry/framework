import { Contract } from "ethers";

import {
  shouldBalanceOf,
  shouldBalanceOfBatch,
  shouldBurnable,
  shouldMint,
  shouldMintBatch,
  shouldSetApprovalForAll,
  shouldSafeTransferFrom,
  shouldSafeBatchTransferFrom,
  shouldCustomURI,
  shouldRoyalty,
  shouldSupply,
} from "@gemunion/contracts-erc1155";

export function shouldBase(factory: () => Promise<Contract>) {
  shouldMint(factory);
  shouldMintBatch(factory);
  shouldBalanceOf(factory);
  shouldBalanceOfBatch(factory);
  shouldSetApprovalForAll(factory);
  shouldSafeTransferFrom(factory);
  shouldSafeBatchTransferFrom(factory);

  shouldCustomURI(factory);
}

export function shouldSimple(factory: () => Promise<Contract>) {
  shouldBase(factory);
  shouldBurnable(factory);
  shouldRoyalty(factory);
  shouldSupply(factory);
}
