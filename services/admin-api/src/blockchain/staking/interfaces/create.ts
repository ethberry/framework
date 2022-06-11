import { TokenType } from "@framework/types";

export interface IStakingItemCreateDto {
  tokenType: TokenType;
  collection: number;
  criteria: number;
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
