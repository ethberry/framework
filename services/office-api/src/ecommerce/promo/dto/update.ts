import type { IProductPromoUpdateDto } from "../interfaces";
import { ProductPromoCreateDto } from "./create";

export class ProductPromoUpdateDto extends ProductPromoCreateDto implements IProductPromoUpdateDto {}
