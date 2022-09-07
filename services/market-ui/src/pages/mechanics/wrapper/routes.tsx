import type { RouteObject } from "react-router-dom";

import { WrapperTokenList } from "./token-list";
import { WrapperToken } from "./token";

export const wrapperRoutes: Array<RouteObject> = [
  {
    path: "/wrapper-tokens",
    children: [
      { index: true, element: <WrapperTokenList /> },
      { path: "/wrapper-tokens/:id", element: <WrapperToken /> },
    ],
  },
];
