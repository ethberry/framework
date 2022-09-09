import type { ISearchDto } from "@gemunion/types-collection";

import { MysteryboxStatus } from "../../../../entities";

export interface IMysteryBoxSearchDto extends ISearchDto {
  mysteryboxStatus: Array<MysteryboxStatus>;
  contractIds: Array<number>;
  templateIds: Array<number>;
  maxPrice: string;
  minPrice: string;
}
