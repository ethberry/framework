import { ClaimType } from "@framework/types";
import type { IBCAssetTokenDto } from "@framework/types";

export interface IClaimRowDto extends IBCAssetTokenDto {
  templateId: number;
  account: string;
  endTimestamp: string;
}

export interface IClaimUploadDto {
  claims: Array<IClaimRowDto>;
  claimType: ClaimType;
}
