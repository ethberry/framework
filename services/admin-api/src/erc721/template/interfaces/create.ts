import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IErc721TemplateCreateDto {
  title: string;
  description: string;
  attributes: string;
  price: IAssetDto;
  amount: number;
  imageUrl: string;
  erc721CollectionId: number;
}
