import type { RouteObject } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { WaitListSection } from "../../../dashboard/mechanics/wait-list";
import { IndexWrapper } from "../../../index-wrapper";
import { WaitListList } from "./list";
import { WaitListItem } from "./item";
import { WaitListContracts } from "./contract";

export const waitListRoutes: Array<RouteObject> = [
  {
    path: "/wait-list",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="wait-list">
            <WaitListSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/wait-list/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <WaitListContracts /> },
          { path: "/wait-list/contracts/:id/:action", element: <WaitListContracts /> },
        ],
      },
      {
        path: "/wait-list/list",
        element: <Protected />,
        children: [
          { index: true, element: <WaitListList /> },

          { path: "/wait-list/list/:id/:action", element: <WaitListList /> },
        ],
      },
      {
        path: "/wait-list/item",
        element: <Protected />,
        children: [
          { index: true, element: <WaitListItem /> },

          { path: "/wait-list/item/:id/:action", element: <WaitListItem /> },
        ],
      },
    ],
  },
];
