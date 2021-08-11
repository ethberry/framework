import {ISortDto} from "@gemunionstudio/types-collection";
import {IProduct} from "@gemunionstudio/framework-types";

export interface IProductSortDto extends ISortDto<IProduct> {
  categoryIds: Array<number>;
  merchantId: number;
}
