import type { RouteObject } from "react-router-dom";
import { RaffleLeaderboard } from "./leaderboard";
import { RaffleTokenList } from "./token-list";
import { IndexWrapper } from "../../index-wrapper";
import { RaffleSection } from "../../dashboard/mechanics/raffle";
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
        path: "/raffle/contracts/",
        children: [
          { index: true, element: <RaffleList /> },
          { path: "/raffle/contracts/:id", element: <RaffleContract /> },
        ],
      },
      {
        path: "/raffle/tokens/",
        children: [
          { index: true, element: <RaffleTokenList /> },
          { path: "/raffle/tokens/:id", element: <RaffleTokenList /> },
        ],
      },
      {
        path: "/raffle/tickets/",
        children: [
          { index: true, element: <RaffleTokenList /> },
          { path: "/raffle/tickets/:id", element: <RaffleTokenList /> },
        ],
      },
      { path: "/raffle/leaderboard", element: <RaffleLeaderboard /> },
    ],
  },
];
