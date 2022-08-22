import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { LotteryRounds } from "./rounds";
import { LotteryTickets } from "./tickets";

export const lotteryRoutes: Array<RouteObject> = [
  {
    path: "/lottery",
    element: <Navigate to="/lottery/rounds" />,
  },
  {
    path: "/lottery/rounds",
    element: <Protected />,
    children: [
      { index: true, element: <LotteryRounds /> },
      { path: "/lottery/rounds/:id", element: <LotteryRounds /> },
    ],
  },
  {
    path: "/lottery/tickets",
    element: <Protected />,
    children: [
      { index: true, element: <LotteryTickets /> },
      { path: "/lottery/tickets/:id", element: <LotteryTickets /> },
    ],
  },
];
