import { ISearchDto } from "@gemunion/types-collection";

import { TokenRarity, UniTokenStatus } from "../../../entities";

export interface IErc998TokenSearchDto extends ISearchDto {
  tokenStatus: Array<UniTokenStatus>;
  tokenId: string;
  rarity: Array<TokenRarity>;
  uniContractIds: Array<number>;
}
