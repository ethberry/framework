import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../../index-wrapper";
import { LotterySection } from "../../../dashboard/mechanics/lottery";
import { LotteryContracts } from "./contract";
import { LotteryTicketContracts } from "./tickets";
import { LotteryRounds } from "./rounds";
import { LotteryTicketTokens } from "./tokens";

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
        path: "/lottery/rounds",
        element: <Protected />,
        children: [
          { index: true, element: <LotteryRounds /> },
          { path: "/lottery/rounds/:id", element: <LotteryRounds /> },
        ],
      },
      {
        path: "/lottery/ticket/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <LotteryTicketContracts /> },
          { path: "/lottery/ticket/contracts/:id", element: <LotteryTicketContracts /> },
        ],
      },
      {
        path: "/lottery/ticket/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <LotteryTicketTokens /> },
          { path: "/lottery/ticket/tokens/:id", element: <LotteryTicketTokens /> },
        ],
      },
    ],
  },
];
