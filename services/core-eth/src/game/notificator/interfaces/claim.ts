import { IClaim } from "@framework/types";

export interface IClaimData {
  claim: IClaim;
  account: string;
  transactionHash: string;
}
