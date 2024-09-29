import type { ISearchDto } from "@ethberry/types-collection";

import { MysteryBoxStatus } from "../../../../../entities";

export interface IMysteryBoxSearchDto extends ISearchDto {
  mysteryBoxStatus: Array<MysteryBoxStatus>;
  contractIds: Array<number>;
  templateIds: Array<number>;
  chainId: bigint;
  merchantId: number;
  maxPrice: string;
  minPrice: string;
}
