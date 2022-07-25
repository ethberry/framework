import { GradeStrategy } from "@framework/types";

import { IAssetDto } from "../../asset/interfaces";

export interface IGradeUpdateDto {
  contractId: number;
  gradeStrategy: GradeStrategy;
  price: IAssetDto;
}
