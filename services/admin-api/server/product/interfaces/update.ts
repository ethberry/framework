import { ProductStatus } from "@gemunion/framework-types";
import { IProductCreateDto } from "./create";

export interface IProductUpdateDto extends IProductCreateDto {
  categoryIds: Array<number>;
  productStatus: ProductStatus;
}
