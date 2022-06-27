import { IAssetDto } from "../../../uni-token/interfaces";

export interface IErc998DropboxCreateDto {
  title: string;
  description: string;
  price: IAssetDto;
  imageUrl: string;
  erc998CollectionId: number;
  erc998TemplateId: number;
}
