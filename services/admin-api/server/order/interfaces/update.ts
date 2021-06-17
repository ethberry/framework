import {OrderStatus} from "@trejgun/solo-types";

import {IOrderCreateDto} from "./create";

export interface IOrderUpdateDto extends IOrderCreateDto {
  orderStatus: OrderStatus;
}
