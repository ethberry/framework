import { ISearchDto } from "@gemunionstudio/types-collection";
import { ProductStatus } from "@gemunionstudio/framework-types";

export interface IProductSearchDto extends ISearchDto {
  categoryIds: Array<number>;
  productStatus: Array<ProductStatus>;
}
