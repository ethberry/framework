import type { RouteObject } from "react-router-dom";

import { LotteryPurchase } from "./purchase";
import { LotteryLeaderboard } from "./leaderboard";
import { LotteryTokenList } from "./token-list";
import { WalletWrapper } from "../../wallet-wrapper";
import { IndexWrapper } from "../../index-wrapper";
import { LotterySection } from "../../dashboard/mechanics/lottery";

export const lotteryRoutes: Array<RouteObject> = [
  {
    path: "/lottery",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="lottery">
            <LotterySection />
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
          { index: true, element: <LotteryTokenList /> },
          { path: "/lottery/ticket/:id", element: <LotteryTokenList /> },
        ],
      },
      { path: "/lottery/leaderboard", element: <LotteryLeaderboard /> },
    ],
  },
];
