import { IAssetDto } from "@framework/types";

export interface IMysteryboxCreateDto {
  title: string;
  description: string;
  item: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  contractId: number;
}
