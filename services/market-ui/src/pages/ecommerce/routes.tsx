import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { EcommerceSection } from "../dashboard/ecommerce";
import { IndexWrapper } from "../index-wrapper";
import { Checkout } from "./checkout";
import { OrderList } from "./order-list";
import { Product } from "./product";
import { ProductList } from "./product-list";

export const ecommerceRoutes: Array<RouteObject> = [
  {
    path: "/ecommerce",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="ecommerce">
            <EcommerceSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/ecommerce/products",
        element: <Protected />,
        children: [
          { index: true, element: <ProductList /> },
          { path: "/ecommerce/products/:id", element: <Product /> },
        ],
      },
      {
        path: "/ecommerce/orders",
        element: <Protected />,
        children: [{ index: true, element: <OrderList /> }],
      },
      {
        path: "/ecommerce/checkout",
        element: <Protected />,
        children: [{ index: true, element: <Checkout /> }],
      },
    ],
  },
];
