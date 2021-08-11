import { OrderStatus } from "@gemunionstudio/framework-types";

import { IOrderCreateDto } from "./create";

export interface IOrderUpdateDto extends IOrderCreateDto {
  orderStatus: OrderStatus;
}
