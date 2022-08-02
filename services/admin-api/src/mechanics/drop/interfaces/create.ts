import { IAssetDto } from "@framework/types";

export interface IDropCreateDto {
  item: IAssetDto;
  price: IAssetDto;
  startTimestamp: string;
  endTimestamp: string;
}
