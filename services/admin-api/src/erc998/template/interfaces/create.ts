import { IAssetDto } from "../../../uni-token/interfaces";

export interface IErc998TemplateCreateDto {
  title: string;
  description: string;
  attributes: string;
  price: IAssetDto;
  amount: number;
  imageUrl: string;
  erc998CollectionId: number;
}
