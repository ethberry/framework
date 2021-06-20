import {ISortDto} from "@trejgun/types-collection";
import {IProduct} from "@trejgun/solo-types";

export interface IProductSortDto extends ISortDto<IProduct> {
  categoryIds: Array<number>;
  merchantId: number;
}
