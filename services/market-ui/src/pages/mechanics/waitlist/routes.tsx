import type { RouteObject } from "react-router-dom";

import { WaitlistItem } from "./item";
import { IndexWrapper } from "../../index-wrapper";
import { WaitlistSection } from "../../dashboard/mechanics/waitlist";
import { WalletWrapper } from "../../wallet-wrapper";

export const waitlistRoutes: Array<RouteObject> = [
  {
    path: "/waitlist",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="waitlist">
            <WaitlistSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/waitlist/item",
        element: <WalletWrapper />,
        children: [{ index: true, element: <WaitlistItem /> }],
      },
    ],
  },
];
