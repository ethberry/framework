import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { LotteryPurchase } from "./purchase";
import { LotteryLeaderboard } from "./leaderboard";
import { LotteryTicketList } from "./ticket-list";
import { WalletWrapper } from "../../wrapper";

export const lotteryRoutes: Array<RouteObject> = [
  {
    path: "/lottery",
    children: [
      { index: true, element: <Navigate to="/lottery/purchase" /> },
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
