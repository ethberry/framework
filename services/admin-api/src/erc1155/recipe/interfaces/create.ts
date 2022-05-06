import { IIngredientsDto } from "./ingredients";

export interface IErc1155RecipeCreateDto {
  title: string;
  description: string;
  erc1155TokenId: number;
  ingredients: Array<IIngredientsDto>;
}
