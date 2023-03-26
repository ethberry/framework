import { GradeAttribute, GradeStrategy, IAssetDto } from "@framework/types";

export interface IGradeUpdateDto {
  contractId: number;
  attribute: GradeAttribute;
  gradeStrategy: GradeStrategy;
  growthRate: number;
  price: IAssetDto;
}
