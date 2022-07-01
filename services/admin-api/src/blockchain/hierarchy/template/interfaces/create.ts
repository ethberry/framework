import { IAssetDto } from "../../../asset/interfaces";

export interface ITemplateCreateDto {
  title: string;
  description: string;
  attributes: string;
  price: IAssetDto;
  amount: string;
  imageUrl: string;
  contractId: number;
}
