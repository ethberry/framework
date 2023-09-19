import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Product } from "./product";
import { Category } from "./category";
import { ProductPromo } from "./promo";
import { Order } from "./order";
import { Photo } from "./photo";
import { Kanban } from "./kanban";
import { Parameter } from "./parameter";
import { Statistics } from "./statistics";

export const ecommerceRoutes: Array<RouteObject> = [
  {
    path: "/products",
    element: <Protected />,
    children: [
      { index: true, element: <Product /> },
      { path: "/products/:id", element: <Product /> },
    ],
  },
  {
    path: "/categories",
    element: <Protected />,
    children: [
      { index: true, element: <Category /> },
      { path: "/categories/:id", element: <Category /> },
    ],
  },
  {
    path: "/parameters",
    element: <Protected />,
    children: [
      { index: true, element: <Parameter /> },
      { path: "/parameters/:id", element: <Parameter /> },
    ],
  },
  {
    path: "/promos",
    element: <Protected />,
    children: [
      { index: true, element: <ProductPromo /> },
      { path: "/promos/:id", element: <ProductPromo /> },
    ],
  },
  {
    path: "/kanban",
    element: <Protected />,
    children: [
      { index: true, element: <Kanban /> },
      { path: "/kanban/:id", element: <Kanban /> },
    ],
  },
  {
    path: "/orders",
    element: <Protected />,
    children: [
      { index: true, element: <Order /> },
      { path: "/orders/:id", element: <Order /> },
    ],
  },
  {
    path: "/photos",
    element: <Protected />,
    children: [{ index: true, element: <Photo /> }],
  },
  {
    path: "/statistics",
    element: <Protected />,
    children: [{ index: true, element: <Statistics /> }],
  },
];
