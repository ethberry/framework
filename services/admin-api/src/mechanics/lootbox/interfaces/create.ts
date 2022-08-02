import { IAssetDto } from "@framework/types";

export interface ILootboxCreateDto {
  title: string;
  description: string;
  item: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
}
