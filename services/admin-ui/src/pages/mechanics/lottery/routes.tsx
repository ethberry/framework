import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { LotteryRounds } from "./rounds";
import { LotteryTickets } from "./tickets";
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
    ],
  },
];
