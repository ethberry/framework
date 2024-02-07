import type { IBCAssetTemplateDto } from "../../exchange/asset/bc-asset";
import { ClaimType } from "../../../../entities";

export interface IClaimRowDto extends IBCAssetTemplateDto {
  id?: string;
  account: string;
  endTimestamp: string;
}

export interface IClaimUploadDto {
  claims: Array<IClaimRowDto>;
  claimType: ClaimType;
}
