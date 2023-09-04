import { IBCAssetTemplateDto } from "../../exchange/asset/bc-asset";

export interface IClaimRowDto extends IBCAssetTemplateDto {
  id?: string;
  account: string;
  endTimestamp: string;
}

export interface IClaimUploadDto {
  claims: Array<IClaimRowDto>;
}
