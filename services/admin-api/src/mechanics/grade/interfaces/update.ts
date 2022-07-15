import { GradeStrategy } from "@framework/types";

import { IAssetDto } from "../../asset/interfaces";

export interface IDropboxUpdateDto {
  contractId: number;
  gradeStrategy: GradeStrategy;
  price: IAssetDto;
}
