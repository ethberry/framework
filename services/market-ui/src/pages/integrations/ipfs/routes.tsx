import type { RouteObject } from "react-router-dom";
import { Navigate } from "react-router-dom";

import { Pinata } from "./pinata";
import { Infura } from "./infura";

export const ipfsRoutes: Array<RouteObject> = [
  {
    path: "/ipfs",
    children: [
      { index: true, element: <Navigate to="/ipfs/infura" /> },
      {
        path: "/ipfs/infura",
        children: [{ index: true, element: <Infura /> }],
      },
      {
        path: "/ipfs/pinata",
        children: [{ index: true, element: <Pinata /> }],
      },
    ],
  },
];
