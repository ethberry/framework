import type { IAssetComponentHistory } from "@framework/types";

// import { IAssetItem } from "@framework/types";

export interface IPurchaseData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  transactionHash: string;
}

export interface IPurchaseRandomData {
  account: string;
  item: IAssetComponentHistory;
  price: Array<IAssetComponentHistory>;
  transactionHash: string;
}
