import type { RouteObject } from "react-router-dom";

import { MysteryboxContractList } from "./contract-list";
import { MysteryboxContract } from "./contract";
import { MysteryboxBoxList } from "./mysterybox-list";
import { MysteryboxBox } from "./mysterybox";
import { MysteryboxTokenList } from "./token-list";
import { MysteryboxToken } from "./token";

export const mysteryboxRoutes: Array<RouteObject> = [
  {
    path: "/mysterybox-contracts",
    children: [
      { index: true, element: <MysteryboxContractList /> },
      { path: "/mysterybox-contracts/:id", element: <MysteryboxContract /> },
    ],
  },
  {
    path: "/mysterybox-boxes",
    children: [
      { index: true, element: <MysteryboxBoxList /> },
      { path: "/mysterybox-boxes/:id", element: <MysteryboxBox /> },
    ],
  },
  {
    path: "/mysterybox-tokens",
    children: [
      { index: true, element: <MysteryboxTokenList /> },
      { path: "/mysterybox-tokens/:id", element: <MysteryboxToken /> },
    ],
  },
];
