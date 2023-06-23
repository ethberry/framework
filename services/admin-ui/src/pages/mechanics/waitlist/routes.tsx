import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { WaitListSection } from "../../dashboard/mechanics/waitlist";
import { IndexWrapper } from "../../index-wrapper";
import { WaitListList } from "./list";
import { WaitListItem } from "./item";
import { WaitListContracts } from "./contract";

export const waitlistRoutes: Array<RouteObject> = [
  {
    path: "/waitlist",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="waitlist">
            <WaitListSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/waitlist/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <WaitListContracts /> },
          { path: "/waitlist/contracts/:id", element: <WaitListContracts /> },
        ],
      },
      {
        path: "/waitlist/list",
        element: <Protected />,
        children: [
          { index: true, element: <WaitListList /> },
          { path: "/waitlist/list/:id", element: <WaitListList /> },
        ],
      },
      {
        path: "/waitlist/item",
        element: <Protected />,
        children: [
          { index: true, element: <WaitListItem /> },
          { path: "/waitlist/item/:id", element: <WaitListItem /> },
        ],
      },
    ],
  },
];
