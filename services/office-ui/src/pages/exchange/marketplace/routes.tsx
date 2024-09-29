import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@ethberry/common-pages";

import { MarketplaceReport } from "./report";
import { MarketplaceChart } from "./chart";
import { MarketplaceDiscrete } from "./discrete";
import { IndexWrapper } from "../../index-wrapper";
import { MarketplaceSection } from "../../dashboard/mechanics/marketplace";

export const marketRoutes: Array<RouteObject> = [
  {
    path: "/marketplace",
    element: <Protected />,
    children: [
      {
        index: true,
        element: <Navigate to="/marketplace/report" />,
      },
      {
        path: "/marketplace/report",
        children: [
          {
            index: true,
            element: (
              <IndexWrapper index="marketplace">
                <MarketplaceSection />
              </IndexWrapper>
            ),
          },
          { path: "/marketplace/report/search", element: <MarketplaceReport /> },
          { path: "/marketplace/report/chart", element: <MarketplaceChart /> },
          { path: "/marketplace/report/discrete", element: <MarketplaceDiscrete /> },
        ],
      },
    ],
  },
];
