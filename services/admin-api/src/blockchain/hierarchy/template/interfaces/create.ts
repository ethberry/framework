import { IAssetDto } from "@framework/types";

export interface ITemplateCreateDto {
  title: string;
  description: string;
  price: IAssetDto;
  amount: bigint;
  imageUrl: string;
  contractId: number;
}
