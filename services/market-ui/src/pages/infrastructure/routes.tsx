import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Profile } from "./profile";
import { Page } from "./page";
import { Feedback } from "./feedback";
import { Merchant } from "./merchant";
import { AcceptInvitation } from "./invitation";

export const infrastructureRoutes: Array<RouteObject> = [
  {
    path: "/profile",
    element: <Protected />,
    children: [
      { index: true, element: <Profile /> },
      { path: "/profile/:tab", element: <Profile /> },
    ],
  },
  {
    path: "/pages",
    element: <Protected />,
    children: [
      { index: true, element: <Page /> },
      { path: "/pages/:slug", element: <Page /> },
    ],
  },
  {
    path: "/feedback",
    element: <Protected />,
    children: [{ index: true, element: <Feedback /> }],
  },
  {
    path: "/merchant",
    element: <Protected />,
    children: [{ index: true, element: <Merchant /> }],
  },
  {
    path: "/invitations/accept/:uuid",
    element: <Protected />,
    children: [{ index: true, element: <AcceptInvitation /> }],
  },
];
