import { GradeAttribute } from "@framework/types";

export interface ISignGradeDto {
  account: string;
  referrer: string;
  tokenId: number;
  attribute: GradeAttribute;
}
