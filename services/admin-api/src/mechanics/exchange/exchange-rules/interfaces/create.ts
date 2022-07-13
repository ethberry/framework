import { IAssetDto } from "../../../asset/interfaces";

export interface IExchangeRuleCreateDto {
  item: IAssetDto;
  ingredients: IAssetDto;
}
