import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { MarketplaceReport } from "./report";
import { MarketplaceChart } from "./chart";
import { MarketplaceRarity } from "./rarity";
import { MarketplaceGrade } from "./grade";
import { IndexWrapper } from "../../index-wrapper";
import { Marketplace } from "../../dashboard/integrations/marketplace";

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
                <Marketplace />
              </IndexWrapper>
            ),
          },
          { path: "/marketplace/report/search", element: <MarketplaceReport /> },
          { path: "/marketplace/report/chart", element: <MarketplaceChart /> },
          { path: "/marketplace/report/rarity", element: <MarketplaceRarity /> },
          { path: "/marketplace/report/grade", element: <MarketplaceGrade /> },
        ],
      },
    ],
  },
];
