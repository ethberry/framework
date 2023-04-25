import { ProductStatus } from "@framework/types";
import { IProductCreateDto } from "./create";

export interface IProductUpdateDto extends IProductCreateDto {
  categoryIds: Array<number>;
  parameterIds: Array<number>;
  productStatus: ProductStatus;
}
