import { GradeStatus, GradeStrategy, IAssetDto } from "@framework/types";

export interface IGradeUpdateDto {
  gradeStrategy: GradeStrategy;
  gradeStatus: GradeStatus;
  growthRate: number;
  price: IAssetDto;
}
