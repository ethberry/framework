import { IOrderItem } from "@framework/types";

export interface IOrderCreateDto {
  userId: number;
  items: Array<IOrderItem>;
  addressId: number;
}
