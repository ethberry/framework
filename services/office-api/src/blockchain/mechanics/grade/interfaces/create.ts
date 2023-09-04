import { GradeStrategy, IAssetDto } from "@framework/types";

export interface IGradeCreateDto {
  contractId: number;
  attribute: string;
  gradeStrategy: GradeStrategy;
  growthRate: number;
  price: IAssetDto;
}
