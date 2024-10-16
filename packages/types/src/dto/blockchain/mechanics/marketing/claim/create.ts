import type { IAssetDto } from "../../../exchange";

export interface IClaimCreateDto {
  chainId: number;
  account: string;
  item: IAssetDto;
  endTimestamp: string;
}
