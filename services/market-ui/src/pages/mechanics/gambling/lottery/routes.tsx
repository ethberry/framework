import type { RouteObject } from "react-router-dom";

import { LotterySection } from "../../../dashboard/mechanics/lottery";
import { IndexWrapper } from "../../../index-wrapper";
import { LotteryTicketTokenList } from "./token-list";
import { LotteryList } from "./lottery-list";
import { LotteryContract } from "./lottery";

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
        children: [
          { index: true, element: <LotteryList /> },
          { path: "/lottery/contracts/:id/:action", element: <LotteryContract /> },
        ],
      },
      {
        path: "/lottery/ticket/tokens",
        children: [
          { index: true, element: <LotteryTicketTokenList /> },
          { path: "/lottery/ticket/tokens/:id", element: <LotteryTicketTokenList /> },
          { path: "/lottery/ticket/tokens/:id/:action", element: <LotteryTicketTokenList /> },
        ],
      },
    ],
  },
];
