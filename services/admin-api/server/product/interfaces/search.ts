import {ISearchDto} from "@trejgun/types-collection";
import {ProductStatus} from "@trejgun/solo-types";

export interface IProductSearchDto extends ISearchDto {
  productStatus: Array<ProductStatus>;
}
