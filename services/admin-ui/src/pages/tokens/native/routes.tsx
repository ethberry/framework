import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { NativeContract } from "./contract";

export const nativeRoutes: Array<RouteObject> = [
  {
    path: "/native-contracts",
    element: <Protected />,
    children: [
      { index: true, element: <NativeContract /> },
      { path: "/native-contracts/:id", element: <NativeContract /> },
    ],
  },
];
