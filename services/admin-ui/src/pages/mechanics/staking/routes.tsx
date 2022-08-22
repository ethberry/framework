import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";
import { StakingRules } from "./rules";
import { StakingReport } from "./report";

export const stakingRoutes: Array<RouteObject> = [
  {
    path: "/staking",
    element: <Navigate to="/staking/rules" />,
  },
  {
    path: "/staking/rules",
    element: <Protected />,
    children: [
      { index: true, element: <StakingRules /> },
      { path: "/staking/rules/:id", element: <StakingRules /> },
    ],
  },
  {
    path: "/staking/report",
    element: <Protected />,
    children: [
      { index: true, element: <Navigate to="/staking/report/search" /> },
      { path: "/staking/report/search", element: <StakingReport /> },
    ],
  },
];
