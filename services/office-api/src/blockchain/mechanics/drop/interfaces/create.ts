import { IAssetDto } from "@framework/types";

export interface IDropCreateDto {
  item: IAssetDto;
  price: IAssetDto;
  merchantId: number;
  startTimestamp: string;
  endTimestamp: string;
}
