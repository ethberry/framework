import { IAssetDto } from "@framework/types";

export interface ITemplateCreateDto {
  title: string;
  description: string;
  price: IAssetDto;
  amount: string;
  imageUrl: string;
  contractId: number;
}
