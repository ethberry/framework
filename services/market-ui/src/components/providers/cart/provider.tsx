import { FC, PropsWithChildren, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { IProduct } from "@framework/types";
import { useApiCall } from "@gemunion/react-hooks";

import { CartContext, ICartItem } from "./context";

interface ICartProviderProps {
  cart?: Array<ICartItem>;
}

export const CartProvider: FC<PropsWithChildren<ICartProviderProps>> = props => {
  const { cart: defaultCart = [], children } = props;
  const [items, setCart] = useState<Array<ICartItem>>(defaultCart);

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const { fn: fetchCartApi } = useApiCall(
    api =>
      api
        .fetchJson({
          url: "/cart",
        })
        .then(json => {
          setCart(json.items);
        }),
    { success: false },
  );

  const fetchCart = async (): Promise<void> => {
    return fetchCartApi();
  };

  const alterCart = (amount: number, product: IProduct): void => {
    const index = items.findIndex(item => item.product.id === product.id);
    const cart = [...items];
    if (index !== -1) {
      cart.splice(index, 1);
    }
    if (amount !== 0) {
      cart.push({ amount, product });
    }
    setCart(cart);
  };

  useEffect(() => {
    void fetchCart();
  }, []);

  const { fn: alterApi } = useApiCall(
    (api, values: { amount: number; product: IProduct }) => {
      const { amount, product } = values;
      return api
        .fetchJson({
          url: "/cart/alter",
          method: "PUT",
          data: {
            amount,
            productId: product.id,
          },
        })
        .then(() => {
          const index = items.findIndex(item => item.product.id === product.id);
          if (index === -1 || items[index].amount < amount) {
            enqueueSnackbar(formatMessage({ id: "snackbar.addedToCart" }), { variant: "success" });
          } else {
            enqueueSnackbar(formatMessage({ id: "snackbar.removedFromCart" }), { variant: "success" });
          }
          return alterCart(amount, product);
        });
    },
    { success: false },
  );

  const alter = (amount: number, product: IProduct): (() => Promise<void>) => {
    return () => {
      return alterApi(void 0, { amount, product });
    };
  };

  const { fn: resetApi } = useApiCall(
    api =>
      api
        .fetchJson({
          url: "/cart",
          method: "PUT",
          data: {
            items: [],
          },
        })
        .then(() => {
          enqueueSnackbar(formatMessage({ id: "snackbar.add-to-cart" }), { variant: "success" });
          setCart([]);
        }),
    { success: false },
  );

  const reset = (): Promise<void> => {
    setCart([]);
    return resetApi();
  };

  return (
    <CartContext.Provider
      value={{
        items,
        alter,
        reset,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
