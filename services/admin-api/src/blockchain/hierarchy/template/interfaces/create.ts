import { IAssetDto } from "../../../../mechanics/asset/interfaces";

export interface ITemplateCreateDto {
  title: string;
  description: string;
  price: IAssetDto;
  amount: string;
  imageUrl: string;
  contractId: number;
}
