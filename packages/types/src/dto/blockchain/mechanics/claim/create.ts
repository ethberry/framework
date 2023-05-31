import { IAssetDto } from "../../exchange/asset/asset";

export interface IClaimItemCreateDto {
  account: string;
  item: IAssetDto;
  endTimestamp: string;
}
