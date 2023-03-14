import { createContext } from "react";
import { IProduct } from "@framework/types";

export interface ICartItem {
  product: IProduct;
  amount: number;
}

export interface ICartContext {
  items: Array<ICartItem>;
  alter: (data: number, product: IProduct) => () => Promise<void>;
  reset: () => void;
}

export const CartContext = createContext<ICartContext>(undefined!);
