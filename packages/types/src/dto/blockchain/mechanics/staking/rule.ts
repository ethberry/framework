import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { StakingRuleStatus } from "../../../../entities";

export interface IStakingRuleItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
  templateIds: Array<number>;
}

export interface IStakingRuleSearchDto extends ISearchDto {
  contractIds: Array<number>;
  stakingRuleStatus: Array<StakingRuleStatus>;
  deposit: IStakingRuleItemSearchDto;
  reward: IStakingRuleItemSearchDto;
}
