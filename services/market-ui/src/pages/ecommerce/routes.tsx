import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { ProductList } from "./product-list";
import { Product } from "./product";
import { OrderList } from "./order-list";
import { Checkout } from "./checkout";

export const ecommerceRoutes: Array<RouteObject> = [
  {
    path: "/products",
    element: <Protected />,
    children: [
      { index: true, element: <ProductList /> },
      { path: "/products/:id", element: <Product /> },
    ],
  },
  {
    path: "/orders",
    element: <Protected />,
    children: [{ index: true, element: <OrderList /> }],
  },
  {
    path: "/checkout",
    element: <Protected />,
    children: [{ index: true, element: <Checkout /> }],
  },
];
