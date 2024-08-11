import { IAssetDto } from "@framework/types";

export interface IMysteryBoxCreateDto {
  title: string;
  description: string;
  content: IAssetDto;
  price: IAssetDto;
  imageUrl: string;
  contractId: number;
}
