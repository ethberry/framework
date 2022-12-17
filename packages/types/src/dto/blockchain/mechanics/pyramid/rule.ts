import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { PyramidRuleStatus } from "../../../../entities";

export interface IPyramidRuleItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

export interface IPyramidRuleSearchDto extends ISearchDto {
  pyramidRuleStatus: Array<PyramidRuleStatus>;
  deposit: IPyramidRuleItemSearchDto;
  reward: IPyramidRuleItemSearchDto;
}
