import { ISearchDto } from "@gemunion/types-collection";

import { MysteryboxStatus } from "../../../../entities";

export interface IMysteryboxSearchDto extends ISearchDto {
  mysteryboxStatus: Array<MysteryboxStatus>;
  contractIds: Array<number>;
  maxPrice: string;
  minPrice: string;
}
