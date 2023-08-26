import { DurationUnit, IAssetDto, TokenType } from "@framework/types";

export interface IPonziItemCreateDto {
  tokenType: TokenType;
  collection: number;
  tokenId: number;
  amount: string;
}

export interface IPonziCreateDto {
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
