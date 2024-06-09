import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

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
