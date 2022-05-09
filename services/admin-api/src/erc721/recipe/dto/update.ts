import { IErc721RecipeUpdateDto } from "../interfaces";
import { Erc721RecipeCreateDto } from "./create";

export class Erc721RecipeUpdateDto extends Erc721RecipeCreateDto implements IErc721RecipeUpdateDto {}
