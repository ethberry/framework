import type { ISearchDto } from "@ethberry/types-collection";
import type { TokenType } from "@ethberry/types-blockchain";

import { PonziRuleStatus } from "../../../../../entities";

export interface IPonziRuleItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

export interface IPonziRuleSearchDto extends ISearchDto {
  merchantId: number;
  contractIds: Array<number>;
  ponziRuleStatus: Array<PonziRuleStatus>;
  deposit: IPonziRuleItemSearchDto;
  reward: IPonziRuleItemSearchDto;
}
