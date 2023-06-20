import type { IAssetComponentHistory } from "@framework/types";

export interface IPurchaseData {
  account: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  transactionHash: string;
}
