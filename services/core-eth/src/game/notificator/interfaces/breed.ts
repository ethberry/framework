import { IAssetComponentHistory } from "@framework/types";

export interface IBreedData {
  items: Array<IAssetComponentHistory>;
  price: Array<IAssetComponentHistory>;
  address: string;
  transactionHash: string;
}
