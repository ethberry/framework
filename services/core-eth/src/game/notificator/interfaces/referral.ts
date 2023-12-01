import { IAsset, IContract } from "@framework/types";

export interface IReferralEventData {
  account: string;
  contract: IContract;
  price: IAsset | null;
  transactionHash: string;
}
