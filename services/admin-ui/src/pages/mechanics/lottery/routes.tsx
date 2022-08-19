import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";
import { LotteryRounds } from "./rounds";

export const lotteryRoutes: Array<RouteObject> = [
  {
    path: "/lottery",
    element: <Navigate to="/lottery/rounds" />,
  },
  {
    path: "/lottery/round",
    element: <Protected />,
    children: [
      { index: true, element: <LotteryRounds /> },
      { path: "/lottery/round/:id", element: <LotteryRounds /> },
    ],
  },
];
