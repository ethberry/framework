import type { IAssetComponentHistory, IDiscrete, IToken } from "@framework/types";

export interface IDiscreteData {
  grade: IDiscrete;
  token: IToken;
  price: Array<IAssetComponentHistory>;
  address: string;
  transactionHash: string;
}
