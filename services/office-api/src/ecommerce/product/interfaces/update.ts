import { ProductStatus } from "@framework/types";
import type { IProductCreateDto } from "./create";

export interface IProductUpdateDto extends IProductCreateDto {
  categoryIds: Array<number>;
  productStatus: ProductStatus;
}
