import { IAssetDto } from "@framework/types";

export interface ILootBoxCreateDto {
  title: string;
  description: string;
  content: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  contractId: number;
  min: number;
  max: number;
}
