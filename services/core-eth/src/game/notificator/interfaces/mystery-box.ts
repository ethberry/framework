import type { IAssetComponentHistory } from "@framework/types";

export interface IUnpackMysteryData {
  address: string;
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  transactionHash: string;
}
