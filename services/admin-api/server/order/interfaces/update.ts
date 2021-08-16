import { OrderStatus } from "@gemunion/framework-types";

import { IOrderCreateDto } from "./create";

export interface IOrderUpdateDto extends IOrderCreateDto {
  orderStatus: OrderStatus;
}
