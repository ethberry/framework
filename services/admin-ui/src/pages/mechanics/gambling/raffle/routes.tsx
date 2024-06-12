import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../../index-wrapper";
import { RaffleSection } from "../../../dashboard/mechanics/raffle";
import { RaffleContracts } from "./contract";
import { RaffleTicketContracts } from "./tickets";
import { RaffleRounds } from "./rounds";
import { RaffleTicketTokens } from "./tokens";

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
        element: <Protected />,
        children: [
          { index: true, element: <RaffleContracts /> },
          { path: "/raffle/contracts/:id/:action", element: <RaffleContracts /> },
        ],
      },
      {
        path: "/raffle/rounds",
        element: <Protected />,
        children: [
          { index: true, element: <RaffleRounds /> },
          { path: "/raffle/rounds/:id", element: <RaffleRounds /> },
          { path: "/raffle/rounds/:id/:action", element: <RaffleRounds /> },
        ],
      },
      {
        path: "/raffle/ticket/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <RaffleTicketContracts /> },
          { path: "/raffle/ticket/contracts/:id/:action", element: <RaffleTicketContracts /> },
        ],
      },
      {
        path: "/raffle/ticket/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <RaffleTicketTokens /> },
          { path: "/raffle/ticket/tokens/:id", element: <RaffleTicketTokens /> },
          { path: "/raffle/ticket/tokens/:id/:action", element: <RaffleTicketTokens /> },
        ],
      },
    ],
  },
];
