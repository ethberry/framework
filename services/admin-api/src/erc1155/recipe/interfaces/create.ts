import { IIngredientsDto } from "./ingredients";

export interface IErc1155RecipeCreateDto {
  erc1155TokenId: number;
  ingredients: Array<IIngredientsDto>;
}
