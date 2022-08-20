import type { RouteObject } from "react-router-dom";

import { ReferralLink } from "./link";
import { ReferralLeaderboard } from "./leaderboard";
import { ReferralReport } from "./report";

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
        path: "/referral/report",
        children: [
          { index: true, element: <ReferralReport /> },
          { path: "/referral/report/:id", element: <ReferralReport /> },
        ],
      },
    ],
  },
];
