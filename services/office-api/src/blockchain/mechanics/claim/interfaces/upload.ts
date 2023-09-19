import type { IBCAssetTemplateDto } from "@framework/types";

export interface IClaimRowDto extends IBCAssetTemplateDto {
  account: string;
  endTimestamp: string;
}

export interface IClaimUploadDto {
  claims: Array<IClaimRowDto>;
}
