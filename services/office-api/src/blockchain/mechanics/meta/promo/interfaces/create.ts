import { IAssetDto } from "@framework/types";

export interface IAssetPromoCreateDto {
  item: IAssetDto;
  price: IAssetDto;
  merchantId: number;
  startTimestamp: string;
  endTimestamp: string;
}
