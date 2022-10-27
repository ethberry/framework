import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Waitlist } from "../../dashboard/mechanics/waitlist";
import { IndexWrapper } from "../../index-wrapper";
import { WaitlistList } from "./list";
import { WaitlistItem } from "./item";

export const waitlistRoutes: Array<RouteObject> = [
  {
    path: "/waitlist",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="waitlist">
            <Waitlist />
          </IndexWrapper>
        ),
      },
      {
        path: "/waitlist/list",
        element: <Protected />,
        children: [
          { index: true, element: <WaitlistList /> },
          { path: "/waitlist/list/:id", element: <WaitlistList /> },
        ],
      },
      {
        path: "/waitlist/item",
        element: <Protected />,
        children: [
          { index: true, element: <WaitlistItem /> },
          { path: "/waitlist/item/:id", element: <WaitlistItem /> },
        ],
      },
    ],
  },
];
