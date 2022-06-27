import { IPaginationDto } from "@gemunion/types-collection";

import { TokenRarity } from "../../../entities";

export interface IErc998AssetSearchDto extends IPaginationDto {
  uniContractIds: Array<number>;
  rarity: Array<TokenRarity>;
}
