import { DurationUnit, IAssetDto, TokenType } from "@framework/types";

export interface IPyramidItemCreateDto {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
}

export interface IPyramidCreateDto {
  title: string;
  description: string;
  // ruleId?: string;
  deposit: IAssetDto;
  reward: IAssetDto;
  durationAmount: number;
  durationUnit: DurationUnit;
  penalty: number;
  recurrent: boolean;
}
