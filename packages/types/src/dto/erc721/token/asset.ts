import { IPaginationDto } from "@gemunion/types-collection";

import { TokenRarity } from "../../../entities";

export interface IErc721AssetSearchDto extends IPaginationDto {
  contractIds: Array<number>;
  rarity: Array<TokenRarity>;
}
