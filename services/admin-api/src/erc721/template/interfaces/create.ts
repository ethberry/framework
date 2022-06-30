import { IAssetDto } from "../../../blockchain/asset/interfaces";

export interface IErc721TemplateCreateDto {
  title: string;
  description: string;
  attributes: string;
  price: IAssetDto;
  amount: string;
  imageUrl: string;
  uniContractId: number;
}
