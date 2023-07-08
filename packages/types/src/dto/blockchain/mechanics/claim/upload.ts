import { IBCAssetDto } from "../../exchange/asset/bc-asset";

export interface IClaimRowDto extends IBCAssetDto {
  id?: string;
  account: string;
  endTimestamp: string;
}

export interface IClaimUploadDto {
  claims: Array<IClaimRowDto>;
}
