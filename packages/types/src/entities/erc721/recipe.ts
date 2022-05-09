import { IIdBase } from "@gemunion/types-collection";

import { IErc721Ingredient } from "./ingredient";
import { IErc721RecipeHistory } from "./recipe-history";
import { IErc721Dropbox } from "./dropbox";
import { IErc721Template } from "./template";

export enum Erc721RecipeStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IErc721Recipe extends IIdBase {
  erc721TemplateId: number;
  erc721Template?: IErc721Template;
  erc721DropboxId: number;
  erc721Dropbox?: IErc721Dropbox;
  ingredients: Array<IErc721Ingredient>;
  recipeStatus: Erc721RecipeStatus;
  history?: Array<IErc721RecipeHistory>;
}
