import type { IAssetComponentHistory } from "@framework/types";

export interface IMysteryPurchaseData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  transactionHash: string;
}

export interface IMysteryUnpackData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  transactionHash: string;
}
