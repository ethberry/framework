import { ProductPromoCreateDto } from "./create";
import type { IProductPromoUpdateDto } from "../interfaces";

export class ProductPromoUpdateDto extends ProductPromoCreateDto implements IProductPromoUpdateDto {}
