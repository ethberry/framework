import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IErc1155TemplateCreateDto {
  title: string;
  description: string;
  attributes: string;
  imageUrl: string;
  price: IAssetDto;
  amount: number;
  erc1155CollectionId: number;
}
