import { IAssetDto } from "@framework/types";

export interface IAssetPromoCreateDto {
  item: IAssetDto;
  price: IAssetDto;
  startTimestamp: string;
  endTimestamp: string;
}
