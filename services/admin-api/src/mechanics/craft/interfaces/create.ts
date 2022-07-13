import { IAssetDto } from "../../asset/interfaces";

export interface IRecipeCreateDto {
  item: IAssetDto;
  ingredients: IAssetDto;
}
