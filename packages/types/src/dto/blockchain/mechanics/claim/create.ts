import type { IAssetDto } from "../../exchange/asset/asset";

export interface IClaimCreateDto {
  chainId: number;
  account: string;
  item: IAssetDto;
  endTimestamp: string;
}
