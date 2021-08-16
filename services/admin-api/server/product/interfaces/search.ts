import { ISearchDto } from "@gemunion/types-collection";
import { ProductStatus } from "@gemunion/framework-types";

export interface IProductSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  productStatus: Array<ProductStatus>;
}
