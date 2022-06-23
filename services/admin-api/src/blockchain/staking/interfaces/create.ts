import { TokenType } from "@framework/types";

export interface IStakingRuleItemCreateDto {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
}

export interface IStakingRuleCreateDto {
  title: string;
  description: string;
  ruleId: string;
  deposit: IStakingRuleItemCreateDto;
  reward: IStakingRuleItemCreateDto;
  duration: number;
  penalty: number;
  recurrent: boolean;
}
