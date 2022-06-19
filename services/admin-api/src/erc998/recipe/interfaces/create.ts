import { IIngredientsDto } from "./ingredients";

export interface IErc998RecipeCreateDto {
  erc998TemplateId: number;
  erc998DropboxId: number;
  ingredients: Array<IIngredientsDto>;
}
