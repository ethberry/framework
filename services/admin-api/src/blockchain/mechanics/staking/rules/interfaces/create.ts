import { IAssetDto, TokenType } from "@framework/types";

export interface IStakingItemCreateDto {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
}

export interface IStakingCreateDto {
  title: string;
  description: string;
  // ruleId?: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  duration: number;
  penalty: number;
  recurrent: boolean;
}
