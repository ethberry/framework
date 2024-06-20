import type { RouteObject } from "react-router-dom";

import { LootContractList } from "./contract-list";
import { LootContract } from "./contract";
import { LootBoxList } from "./box-list";
import { LootBox } from "./box";
import { LootTokenList } from "./token-list";
import { LootBoxToken } from "./token";
import { IndexWrapper } from "../../../index-wrapper";
import { LootSection } from "../../../dashboard/mechanics/loot";

export const lootRoutes: Array<RouteObject> = [
  {
    path: "/loot",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="loot">
            <LootSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/loot/contracts",
        children: [
          { index: true, element: <LootContractList /> },
          { path: "/loot/contracts/:id/:action", element: <LootContract /> },
        ],
      },
      {
        path: "/loot/boxes",
        children: [
          { index: true, element: <LootBoxList /> },

          { path: "/loot/boxes/:id/:action", element: <LootBox /> },
        ],
      },
      {
        path: "/loot/tokens",
        children: [
          { index: true, element: <LootTokenList /> },

          { path: "/loot/tokens/:id/:action", element: <LootBoxToken /> },
        ],
      },
    ],
  },
];
