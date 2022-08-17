import type { RouteObject } from "react-router-dom";

import { MysteryboxContractList } from "./contract-list";
import { MysteryboxContract } from "./contract";
import { MysteryboxTemplateList } from "./template-list";
import { MysteryboxTemplate } from "./template";
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
    path: "/mysterybox-templates",
    children: [
      { index: true, element: <MysteryboxTemplateList /> },
      { path: "/mysterybox-templates/:id", element: <MysteryboxTemplate /> },
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
