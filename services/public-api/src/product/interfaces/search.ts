import { ISortDto } from "@gemunion/types-collection";
import { IProduct } from "@gemunion/framework-types";

export interface IProductSortDto extends ISortDto<IProduct> {
  categoryIds: Array<number>;
  merchantId: number;
}
