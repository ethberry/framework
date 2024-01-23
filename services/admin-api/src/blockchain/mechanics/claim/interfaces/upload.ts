import type { IBCAssetTemplateDto } from "@framework/types";
import { ClaimType } from "@framework/types";

export interface IClaimRowDto extends IBCAssetTemplateDto {
  account: string;
  endTimestamp: string;
  claimType: ClaimType;
}

export interface IClaimUploadDto {
  claims: Array<IClaimRowDto>;
}
