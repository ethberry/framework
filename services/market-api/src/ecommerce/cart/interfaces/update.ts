import { ICartItem } from "@framework/types";

export interface ICartUpdateDto {
  items: Array<ICartItem>;
}
