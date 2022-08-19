import { GradeStrategy, IAssetDto } from "@framework/types";

export interface IGradeUpdateDto {
  contractId: number;
  gradeStrategy: GradeStrategy;
  price: IAssetDto;
}
