import { IIdDateBase } from "@gemunion/types-collection";

import { IErc998Ingredient } from "./ingredient";
import { IErc998RecipeHistory } from "./recipe-history";
import { IErc998Dropbox } from "./dropbox";
import { IErc998Template } from "./template";

export enum Erc998RecipeStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc998Recipe extends IIdDateBase {
  erc998TemplateId: number | null;
  erc998Template?: IErc998Template;
  erc998DropboxId: number | null;
  erc998Dropbox?: IErc998Dropbox;
  ingredients: Array<IErc998Ingredient>;
  recipeStatus: Erc998RecipeStatus;
  history?: Array<IErc998RecipeHistory>;
}
