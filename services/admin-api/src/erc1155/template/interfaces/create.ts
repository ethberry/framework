import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IErc1155TemplateCreateDto {
  title: string;
  description: string;
  attributes: string;
  imageUrl: string;
  price: IAssetDto;
  amount: string;
  erc1155CollectionId: number;
}
