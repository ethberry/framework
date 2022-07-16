import { IAssetDto } from "../../asset/interfaces";

export interface ILootboxCreateDto {
  title: string;
  description: string;
  item: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
}
