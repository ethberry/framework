import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IUniTemplateCreateDto {
  title: string;
  description: string;
  attributes: string;
  price: IAssetDto;
  amount: number;
  imageUrl: string;
  erc998CollectionId: number;
}
