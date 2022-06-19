import { IPaginationDto } from "@gemunion/types-collection";

import { TokenRarity } from "../../../entities";

export interface IErc998AssetSearchDto extends IPaginationDto {
  erc998CollectionIds: Array<number>;
  rarity: Array<TokenRarity>;
}
