import type { RouteObject } from "react-router-dom";

import { DexSection } from "../dashboard/integrations/dex";
import { IndexWrapper } from "../index-wrapper";
import { CoinGecko } from "./coin-gecko";
import { ipfsRoutes } from "./ipfs/routes";

export const integrationsRoutes: Array<RouteObject> = [
  {
    path: "/dex",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="dex">
            <DexSection />
          </IndexWrapper>
        ),
      },
    ],
  },
  {
    path: "/coin-gecko",
    children: [{ index: true, element: <CoinGecko /> }],
  },
  ...ipfsRoutes,
];
