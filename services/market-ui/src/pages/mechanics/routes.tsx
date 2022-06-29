import type { RouteObject } from "react-router-dom";
import { Protected } from "@gemunion/firebase-login";

import { ExchangeList } from "./exchange";
import { stakingRoutes } from "./staking/routes";
import { Airdrop } from "./airdrop";
import { AirdropWrapper } from "./airdrop/wrapper";

const routes: Array<RouteObject> = [
  ...stakingRoutes,
  {
    path: "/airdrop",
    element: <AirdropWrapper />,
    children: [{ index: true, element: <Airdrop /> }],
  },
  {
    path: "/exchange",
    element: <Protected />,
    children: [
      { index: true, element: <ExchangeList /> },
      { path: "/craft/:tab", element: <ExchangeList /> },
    ],
  },
];
