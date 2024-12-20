import type { RouteObject } from "react-router-dom";

import { WaitListItem } from "./item";
import { IndexWrapper } from "../../../index-wrapper";
import { WaitListSection } from "../../../dashboard/mechanics/waitlist";
import { WalletWrapper } from "../../../wallet-wrapper";

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
        path: "/wait-list/item",
        element: <WalletWrapper />,
        children: [{ index: true, element: <WaitListItem /> }],
      },
    ],
  },
];
