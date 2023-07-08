import type { IBCAssetDto } from "@framework/types";

export interface IClaimRowDto extends IBCAssetDto {
  account: string;
  endTimestamp: string;
}

export interface IClaimUploadDto {
  claims: Array<IClaimRowDto>;
}
