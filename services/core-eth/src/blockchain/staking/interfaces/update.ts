import { TokenType } from "@framework/types";

export interface IStakingRuleItemUpdateDto {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
  stakingRuleId: number;
}

export interface IStakingRuleUpdateDto {
  title: string;
  description: string;
  deposit: IStakingRuleItemUpdateDto;
  reward: IStakingRuleItemUpdateDto;
  duration: number;
  penalty: number;
  recurrent: boolean;
}
