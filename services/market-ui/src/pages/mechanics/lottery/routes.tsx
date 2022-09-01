import type { RouteObject } from "react-router-dom";

import { LotteryPurchase } from "./purchase";
import { LotteryLeaderboard } from "./leaderboard";
import { LotteryTicketList } from "./ticket-list";
import { WalletWrapper } from "../../wallet-wrapper";
import { IndexWrapper } from "../../index-wrapper";
import { Lottery } from "../../dashboard/mechanics/lottery";

export const lotteryRoutes: Array<RouteObject> = [
  {
    path: "/lottery",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="lottery">
            <Lottery />
          </IndexWrapper>
        ),
      },
      {
        path: "/lottery/purchase",
        element: <WalletWrapper />,
        children: [{ index: true, element: <LotteryPurchase /> }],
      },
      {
        path: "/lottery/ticket",
        children: [
          { index: true, element: <LotteryTicketList /> },
          { path: "/lottery/ticket/:id", element: <LotteryTicketList /> },
        ],
      },
      { path: "/lottery/leaderboard", element: <LotteryLeaderboard /> },
    ],
  },
];
