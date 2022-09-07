import type { ISearchDto } from "@gemunion/types-collection";

import { StakingStatus, TokenType } from "../../../../entities";

export interface IStakingRuleItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

export interface IStakingRuleSearchDto extends ISearchDto {
  stakingStatus: Array<StakingStatus>;
  deposit: IStakingRuleItemSearchDto;
  reward: IStakingRuleItemSearchDto;
}
