import { ISearchDto } from "@gemunion/types-collection";

import { MysteryboxStatus } from "../../../entities";

export interface IMysteryboxSearchDto extends ISearchDto {
  mysteryboxStatus: Array<MysteryboxStatus>;
  maxPrice: string;
  minPrice: string;
}
