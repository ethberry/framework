import { ICartItem } from "./cart-item";

export interface ICart {
  userId?: number;
  items: Array<ICartItem>;
}
