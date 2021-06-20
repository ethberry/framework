import {ISearchDto} from "@trejgun/types-collection";
import {ProductStatus} from "@trejgun/solo-types";

export interface IProductSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  productStatus: Array<ProductStatus>;
}
