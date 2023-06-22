import { IGrade, IToken } from "@framework/types";

export interface IGradeData {
  grade: IGrade;
  token: IToken;
  address: string;
  transactionHash: string;
}
