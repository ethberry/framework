import { FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { ApiContext, ApiError } from "@gemunion/provider-api-firebase";
import { IProduct } from "@framework/types";

import { CartContext, ICartItem } from "./context";

interface ICartProviderProps {
  cart?: Array<ICartItem>;
}

export const CartProvider: FC<PropsWithChildren<ICartProviderProps>> = props => {
  const { cart: defaultCart = [], children } = props;
  const [items, setCart] = useState<Array<ICartItem>>(defaultCart);

  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useContext(ApiContext);

  const fetchCart = async (): Promise<void> => {
    return api
      .fetchJson({
        url: "/cart",
      })
      .then(json => {
        setCart(json.items);
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
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

  const alter = (amount: number, product: IProduct): (() => Promise<void>) => {
    return () => {
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
            enqueueSnackbar(formatMessage({ id: "snackbar.added-to-cart" }), { variant: "success" });
          } else {
            enqueueSnackbar(formatMessage({ id: "snackbar.removed-from-cart" }), { variant: "success" });
          }
          return alterCart(amount, product);
        })
        .catch((e: ApiError) => {
          if (e.status) {
            enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
          } else {
            console.error(e);
            enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
          }
        });
    };
  };

  const reset = (): Promise<void> => {
    setCart([]);
    return api
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
      })
      .catch((e: ApiError) => {
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
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
