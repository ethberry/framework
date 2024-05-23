import type { IAssetComponentHistory } from "@framework/types";

export interface ILootPurchaseData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  transactionHash: string;
}

export interface ILootUnpackData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  transactionHash: string;
}
