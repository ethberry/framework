import { IAssetDto } from "../../../../blockchain/asset/interfaces";

export interface IExchangeRuleCreateDto {
  item: IAssetDto;
  ingredients: IAssetDto;
}
