import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../../index-wrapper";
import { NativeSection } from "../../../dashboard/hierarchy/native";
import { NativeContract } from "./contract";

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
        ],
      },
    ],
  },
];
