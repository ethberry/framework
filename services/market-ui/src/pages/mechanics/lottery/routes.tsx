import type { RouteObject } from "react-router-dom";

import { LotteryTicket } from "./ticket";
import { LotteryLeaderboard } from "./leaderboard";

export const lotteryRoutes: Array<RouteObject> = [
  {
    path: "/lottery",
    children: [
      { index: true, element: <LotteryTicket /> },
      {
        path: "/lottery/ticket",
        children: [{ index: true, element: <LotteryTicket /> }],
      },
      { path: "/lottery/leaderboard", element: <LotteryLeaderboard /> },
    ],
  },
];
