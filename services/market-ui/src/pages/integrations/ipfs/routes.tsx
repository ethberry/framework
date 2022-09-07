import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Pinata } from "./pinata";

export const ipfsRoutes: Array<RouteObject> = [
  {
    path: "/ipfs",
    children: [
      { index: true, element: <Navigate to="/ipfs/pinata" /> },
      {
        path: "/ipfs/pinata",
        children: [{ index: true, element: <Pinata /> }],
      },
    ],
  },
];
