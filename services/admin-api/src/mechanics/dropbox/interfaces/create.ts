import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IDropboxCreateDto {
  title: string;
  description: string;
  price: IAssetDto;
  imageUrl: string;
  erc998CollectionId: number;
  erc998TemplateId: number;
}
