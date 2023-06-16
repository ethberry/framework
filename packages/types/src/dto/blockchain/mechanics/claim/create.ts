import { IAssetDto } from "../../exchange/asset/asset";

export interface IClaimCreateDto {
  account: string;
  item: IAssetDto;
  endTimestamp: string;
}
