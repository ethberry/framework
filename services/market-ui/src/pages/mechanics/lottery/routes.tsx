import type { RouteObject } from "react-router-dom";
import { LotteryLeaderboard } from "./leaderboard";
import { LotteryTokenList } from "./token-list";
import { IndexWrapper } from "../../index-wrapper";
import { LotterySection } from "../../dashboard/mechanics/lottery";
import { LotteryList } from "./lottery-list";
import { LotteryContract } from "./lottery";
import { Erc721Token } from "../../hierarchy/erc721/token";

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
        path: "/lottery/contracts/",
        children: [
          { index: true, element: <LotteryList /> },
          { path: "/lottery/contracts/:id", element: <LotteryContract /> },
        ],
      },
      {
        path: "/lottery/tokens/",
        children: [
          { index: true, element: <LotteryTokenList /> },
          { path: "/lottery/tokens/:id", element: <LotteryTokenList /> },
        ],
      },
      {
        path: "/lottery/ticket",
        children: [
          { index: true, element: <LotteryTokenList /> },
          { path: "/lottery/ticket/:id", element: <LotteryTokenList /> },
        ],
      },
      { path: "/lottery/leaderboard", element: <LotteryLeaderboard /> },
    ],
  },
];
