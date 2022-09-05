import type { RouteObject } from "react-router-dom";

import { Breed } from "./main";
import { WalletWrapper } from "../../wallet-wrapper";

export const breedRoutes: Array<RouteObject> = [
  {
    path: "/breed",
    element: <WalletWrapper />,
    children: [{ index: true, element: <Breed /> }],
  },
];
