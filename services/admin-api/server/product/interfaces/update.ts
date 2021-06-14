import {ProductStatus} from "@trejgun/solo-types";
import {IProductCreateDto} from "./create";

export interface IProductUpdateDto extends IProductCreateDto {
  productStatus: ProductStatus;
}
