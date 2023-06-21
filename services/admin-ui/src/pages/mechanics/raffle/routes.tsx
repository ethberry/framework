import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../index-wrapper";
import { RaffleSection } from "../../dashboard/mechanics/raffle";
import { RaffleContracts } from "./contract";
import { RaffleRounds } from "./rounds";
import { RaffleTickets } from "./tickets";

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
          { path: "/raffle/contracts/:id", element: <RaffleContracts /> },
        ],
      },
      {
        path: "/raffle/rounds",
        element: <Protected />,
        children: [
          { index: true, element: <RaffleRounds /> },
          { path: "/raffle/rounds/:id", element: <RaffleRounds /> },
        ],
      },
      {
        path: "/raffle/tickets",
        element: <Protected />,
        children: [
          { index: true, element: <RaffleTickets /> },
          { path: "/raffle/tickets/:id", element: <RaffleTickets /> },
        ],
      },
    ],
  },
];
