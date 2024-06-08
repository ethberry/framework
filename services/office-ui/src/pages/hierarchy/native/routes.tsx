import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { NativeContract } from "./contract";
import { IndexWrapper } from "../../index-wrapper";
import { NativeSection } from "../../dashboard/hierarchy/native";

export const nativeRoutes: Array<RouteObject> = [
  {
    path: "/native",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="native">
            <NativeSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/native/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <NativeContract /> },
          { path: "/native/contracts/:id", element: <NativeContract /> },
          { path: "/native/contracts/:id/:action", element: <NativeContract /> },
        ],
      },
    ],
  },
];
