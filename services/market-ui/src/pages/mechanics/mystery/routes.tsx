import type { RouteObject } from "react-router-dom";

import { MysteryboxContractList } from "./contract-list";
import { MysteryboxContract } from "./contract";
import { MysteryBoxList } from "./mysterybox-list";
import { MysteryBox } from "./mysterybox";
import { MysteryboxTokenList } from "./token-list";
import { MysteryboxToken } from "./token";

export const mysteryboxRoutes: Array<RouteObject> = [
  {
    path: "/mystery-contracts",
    children: [
      { index: true, element: <MysteryboxContractList /> },
      { path: "/mystery-contracts/:id", element: <MysteryboxContract /> },
    ],
  },
  {
    path: "/mystery-boxes",
    children: [
      { index: true, element: <MysteryBoxList /> },
      { path: "/mystery-boxes/:id", element: <MysteryBox /> },
    ],
  },
  {
    path: "/mystery-tokens",
    children: [
      { index: true, element: <MysteryboxTokenList /> },
      { path: "/mystery-tokens/:id", element: <MysteryboxToken /> },
    ],
  },
];
