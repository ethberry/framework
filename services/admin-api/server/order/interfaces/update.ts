import {OrderStatus} from "@gemunionstudio/solo-types";

import {IOrderCreateDto} from "./create";

export interface IOrderUpdateDto extends IOrderCreateDto {
  orderStatus: OrderStatus;
}
