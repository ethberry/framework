import type { RouteObject } from "react-router-dom";

import { DexSection } from "../dashboard/integrations/dex";
import { IndexWrapper } from "../index-wrapper";
import { OneInch } from "./dex/1inch";
import { Uniswap } from "./dex/uniswap";
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
      {
        path: "/dex/1inch",
        children: [{ index: true, element: <OneInch /> }],
      },
      {
        path: "/dex/uniswap",
        children: [{ index: true, element: <Uniswap /> }],
      },
    ],
  },
  {
    path: "/coin-gecko",
    children: [{ index: true, element: <CoinGecko /> }],
  },
  ...ipfsRoutes,
];
