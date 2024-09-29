import type { ISearchableDto } from "@ethberry/types-collection";

import { IAssetDto } from "../../../../exchange/asset/asset";

export interface IWaitListListCreateDto extends ISearchableDto {
  item: IAssetDto;
  contractId: number;
  isPrivate: boolean;
}
