import { IAssetComponentHistory, IGrade, IToken } from "@framework/types";

export interface IGradeData {
  grade: IGrade;
  token: IToken;
  price: Array<IAssetComponentHistory>;
  address: string;
  transactionHash: string;
}
