import { IAssetDto } from "../../../../blockchain/asset/interfaces";

export interface IExchangeCreateDto {
  item: IAssetDto;
  ingredients: IAssetDto;
}
