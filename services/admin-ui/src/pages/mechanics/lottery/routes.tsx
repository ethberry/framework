import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";
import { LotteryRounds } from "./rounds";

export const lotteryRoutes: Array<RouteObject> = [
  {
    path: "/lottery/rounds",
    element: <Protected />,
    children: [
      { index: true, element: <LotteryRounds /> },
      { path: "/lottery/rounds/:id", element: <LotteryRounds /> },
    ],
  },
];
