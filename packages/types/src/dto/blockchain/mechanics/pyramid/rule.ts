import type { ISearchDto } from "@gemunion/types-collection";

import { PyramidStakingStatus, TokenType } from "../../../../entities";

export interface IPyramidRuleItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

export interface IPyramidRuleSearchDto extends ISearchDto {
  stakingStatus: Array<PyramidStakingStatus>;
  deposit: IPyramidRuleItemSearchDto;
  reward: IPyramidRuleItemSearchDto;
}
