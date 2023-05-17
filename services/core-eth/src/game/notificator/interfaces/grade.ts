import { GradeAttribute } from "@framework/types";

export interface IGradeData {
  account: string;
  tokenId: string;
  gradeType: GradeAttribute;
  transactionHash: string;
}
