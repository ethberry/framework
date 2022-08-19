import type { RouteObject } from "react-router-dom";

import { ReferralLink } from "./link";
import { ReferralLeaderboard } from "./leaderboard";
import { ReferralHistory } from "./reward";

export const referralRoutes: Array<RouteObject> = [
  {
    path: "/referral",
    children: [
      { index: true, element: <ReferralLink /> },
      {
        path: "/referral/link",
        children: [{ index: true, element: <ReferralLink /> }],
      },
      { path: "/referral/leaderboard", element: <ReferralLeaderboard /> },
      {
        path: "/referral/reward",
        children: [
          { index: true, element: <ReferralHistory /> },
          { path: "/referral/reward/:id", element: <ReferralHistory /> },
        ],
      },
    ],
  },
];
