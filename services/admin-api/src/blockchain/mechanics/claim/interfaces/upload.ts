import type { IBCAssetDto } from "@framework/types";

export interface IClaimRow extends IBCAssetDto {
  account: string;
  endTimestamp: string;
}

export interface IClaimUploadDto {
  claims: Array<IClaimRow>;
}
