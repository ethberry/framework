import type { RouteObject } from "react-router-dom";

import { RaffleSection } from "../../../dashboard/mechanics/raffle";
import { IndexWrapper } from "../../../index-wrapper";
import { RaffleTicketTokenList } from "./token-list";
import { RaffleList } from "./raffle-list";
import { RaffleContract } from "./raffle";

export const raffleRoutes: Array<RouteObject> = [
  {
    path: "/raffle",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="raffle">
            <RaffleSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/raffle/contracts",
        children: [
          { index: true, element: <RaffleList /> },
          { path: "/raffle/contracts/:id/:action", element: <RaffleContract /> },
        ],
      },
      {
        path: "/raffle/ticket/tokens",
        children: [
          { index: true, element: <RaffleTicketTokenList /> },
          { path: "/raffle/ticket/tokens/:id/:action", element: <RaffleTicketTokenList /> },
        ],
      },
    ],
  },
];
