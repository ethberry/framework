import type { IClaim } from "@framework/types";

export interface IClaimData {
  claim: IClaim;
  address: string;
  transactionHash: string;
}
