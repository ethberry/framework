import { GradeStrategy } from "@framework/types";

import { IAssetDto } from "../../asset/interfaces";

export interface ILootboxUpdateDto {
  contractId: number;
  gradeStrategy: GradeStrategy;
  price: IAssetDto;
}
