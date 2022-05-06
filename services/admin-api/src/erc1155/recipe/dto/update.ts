import { IErc1155RecipeUpdateDto } from "../interfaces";
import { Erc1155RecipeCreateDto } from "./create";

export class Erc1155RecipeUpdateDto extends Erc1155RecipeCreateDto implements IErc1155RecipeUpdateDto {}
