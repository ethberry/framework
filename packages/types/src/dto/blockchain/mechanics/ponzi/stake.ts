import type { ISearchDto } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { PonziRuleStatus } from "../../../../entities";

export interface IPonziStakeItemSearchDto {
  tokenType: Array<TokenType>;
  contractIds: Array<number>;
}

export interface IPonziStakesSearchDto extends ISearchDto {
  account: string;
  stakeStatus: Array<PonziRuleStatus>;
  deposit: IPonziStakeItemSearchDto;
  reward: IPonziStakeItemSearchDto;
  startTimestamp: string;
  endTimestamp: string;
}
