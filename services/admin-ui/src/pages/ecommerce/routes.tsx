import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Product } from "./product";
import { Category } from "./category";
import { Promo } from "./promo";
import { Order } from "./order";
import { Photo } from "./photo";
import { Kanban } from "./kanban";
import { Parameter } from "./parameter";
import { Statistics } from "./statistics";
import { IndexWrapper } from "../index-wrapper";
import { EcommerceSection } from "../dashboard/ecommerce";

export const ecommerceRoutes: Array<RouteObject> = [
  {
    path: "/ecommerce",
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
      { index: true, element: <Product /> },
      { path: "/ecommerce/products/:id", element: <Product /> },
    ],
  },
  {
    path: "/ecommerce/categories",
    element: <Protected />,
    children: [
      { index: true, element: <Category /> },
      { path: "/ecommerce/categories/:id", element: <Category /> },
    ],
  },
  {
    path: "/ecommerce/parameters",
    element: <Protected />,
    children: [
      { index: true, element: <Parameter /> },
      { path: "/ecommerce/parameters/:id", element: <Parameter /> },
    ],
  },
  {
    path: "/ecommerce/promos",
    element: <Protected />,
    children: [
      { index: true, element: <Promo /> },
      { path: "/ecommerce/promos/:id", element: <Promo /> },
    ],
  },
  {
    path: "/ecommerce/kanban",
    element: <Protected />,
    children: [
      { index: true, element: <Kanban /> },
      { path: "/ecommerce/kanban/:id", element: <Kanban /> },
    ],
  },
  {
    path: "/ecommerce/orders",
    element: <Protected />,
    children: [
      { index: true, element: <Order /> },
      { path: "/ecommerce/orders/:id", element: <Order /> },
    ],
  },
  {
    path: "/ecommerce/photos",
    element: <Protected />,
    children: [{ index: true, element: <Photo /> }],
  },
  {
    path: "/ecommerce/statistics",
    element: <Protected />,
    children: [{ index: true, element: <Statistics /> }],
  },
];
