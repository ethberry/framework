import { OrderStatus } from "@framework/types";

import type { IOrderCreateDto } from "./create";

export interface IOrderUpdateDto extends IOrderCreateDto {
  orderStatus: OrderStatus;
}
