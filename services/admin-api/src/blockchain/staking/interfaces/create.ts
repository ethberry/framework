import { TokenType } from "@framework/types";
import { IAssetDto } from "../../../uni-token/interfaces";

export interface IStakingItemCreateDto {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
}

export interface IStakingCreateDto {
  title: string;
  description: string;
  ruleId: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  duration: number;
  penalty: number;
  recurrent: boolean;
}
