import { IPaginationDto } from "@gemunion/types-collection";

import { TokenRarity } from "../../../entities";

export interface IErc998AssetSearchDto extends IPaginationDto {
  contractIds: Array<number>;
  rarity: Array<TokenRarity>;
}
