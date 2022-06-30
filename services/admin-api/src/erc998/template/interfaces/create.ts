import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface ITemplateCreateDto {
  title: string;
  description: string;
  attributes: string;
  price: IAssetDto;
  amount: string;
  imageUrl: string;
  erc998CollectionId: number;
}
