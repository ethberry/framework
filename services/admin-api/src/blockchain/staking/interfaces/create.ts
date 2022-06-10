import { TokenType } from "@framework/types";

export interface IStakingItemCreateDto {
  tokenType: TokenType;
  token: number;
  criteria: string;
  amount: string;
}

export interface IStakingCreateDto {
  title: string;
  description: string;
  deposit: IStakingItemCreateDto;
  reward: IStakingItemCreateDto;
  duration: number;
  penalty: number;
  recurrent: boolean;
}
