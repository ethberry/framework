import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { ReferralCabinet } from "./cabinet";
import { ReferralLeaderboard } from "./leaderboard";
import { ReferralReport } from "./report";
import { ReferralChart } from "./chart";
import { IndexWrapper } from "../../../index-wrapper";
import { ReferralSection } from "../../../dashboard/mechanics/referral";
import { ReferralReward } from "./reward";
import { ReferralTree } from "./tree";

export const referralRoutes: Array<RouteObject> = [
  {
    path: "/referral",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="referral">
            <ReferralSection />
          </IndexWrapper>
        ),
      },
      { path: "/referral/reward", element: <ReferralReward /> },
      { path: "/referral/tree", element: <ReferralTree /> },
      {
        path: "/referral/cabinet",
        children: [{ index: true, element: <ReferralCabinet /> }],
      },
      { path: "/referral/leaderboard", element: <ReferralLeaderboard /> },
      {
        path: "/referral/report",
        children: [
          { index: true, element: <Navigate to="/referral/report/search" /> },
          { path: "/referral/report/search", element: <ReferralReport /> },
          { path: "/referral/report/chart", element: <ReferralChart /> },
        ],
      },
    ],
  },
];
