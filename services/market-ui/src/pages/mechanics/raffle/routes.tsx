import type { RouteObject } from "react-router-dom";

import { RafflePurchase } from "./purchase";
import { RaffleLeaderboard } from "./leaderboard";
import { RaffleTokenList } from "./token-list";
import { WalletWrapper } from "../../wallet-wrapper";
import { IndexWrapper } from "../../index-wrapper";
import { RaffleSection } from "../../dashboard/mechanics/raffle";

export const raffleRoutes: Array<RouteObject> = [
  {
    path: "/raffle",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="raffle">
            <RaffleSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/raffle/purchase",
        element: <WalletWrapper />,
        children: [{ index: true, element: <RafflePurchase /> }],
      },
      {
        path: "/raffle/ticket",
        children: [
          { index: true, element: <RaffleTokenList /> },
          { path: "/raffle/ticket/:id", element: <RaffleTokenList /> },
        ],
      },
      { path: "/raffle/leaderboard", element: <RaffleLeaderboard /> },
    ],
  },
];
