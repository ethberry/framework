import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../index-wrapper";
import { LotterySection } from "../../dashboard/mechanics/lottery";
import { LotteryContracts } from "./contract";
import { LotteryTickets } from "./tickets";
import { LotteryRounds } from "./rounds";
import { LotteryTokens } from "./tokens";

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
        path: "/lottery/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <LotteryContracts /> },
          { path: "/lottery/contracts/:id", element: <LotteryContracts /> },
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
      {
        path: "/lottery/rounds",
        element: <Protected />,
        children: [
          { index: true, element: <LotteryRounds /> },
          { path: "/lottery/rounds/:id", element: <LotteryRounds /> },
        ],
      },
      {
        path: "/lottery/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <LotteryTokens /> },
          { path: "/lottery/tokens/:id", element: <LotteryTokens /> },
        ],
      },
    ],
  },
];
