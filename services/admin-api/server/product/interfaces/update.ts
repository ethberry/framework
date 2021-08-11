import {ProductStatus} from "@gemunionstudio/solo-types";
import {IProductCreateDto} from "./create";

export interface IProductUpdateDto extends IProductCreateDto {
  categoryIds: Array<number>;
  productStatus: ProductStatus;
}
