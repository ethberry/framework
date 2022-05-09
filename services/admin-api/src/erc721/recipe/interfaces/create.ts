import { IIngredientsDto } from "./ingredients";

export interface IErc721RecipeCreateDto {
  erc721TemplateId: number;
  erc721DropboxId: number;
  ingredients: Array<IIngredientsDto>;
}
