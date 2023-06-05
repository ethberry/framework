import { IProductItemUpdateDto } from "../interfaces";
import { ProductItemCreateDto } from "./create";

export class ProductItemUpdateDto extends ProductItemCreateDto implements IProductItemUpdateDto {}
