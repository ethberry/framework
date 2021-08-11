import {ISortDto} from "@gemunionstudio/types-collection";
import {IProduct} from "@gemunionstudio/solo-types";

export interface IProductSortDto extends ISortDto<IProduct> {
  categoryIds: Array<number>;
  merchantId: number;
}
