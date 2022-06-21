import { TokenType } from "@framework/types";

export interface IStakingItemUpdateDto {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
  stakingId: number;
}

export interface IStakingUpdateDto {
  title: string;
  description: string;
  deposit: IStakingItemUpdateDto;
  reward: IStakingItemUpdateDto;
  duration: number;
  penalty: number;
  recurrent: boolean;
}
