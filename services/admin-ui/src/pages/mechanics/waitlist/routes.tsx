import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Waitlist } from "./main";

export const waitlistRoutes: Array<RouteObject> = [
  {
    path: "/waitlist",
    element: <Protected />,
    children: [{ index: true, element: <Waitlist /> }],
  },
];
