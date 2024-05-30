import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../../index-wrapper";
import { LootSection } from "../../../dashboard/mechanics/loot";
import { LootBox } from "./box";
import { LootContract } from "./contract";
import { LootToken } from "./token";

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
        element: <Protected />,
        children: [
          { index: true, element: <LootContract /> },
          { path: "/loot/contracts/:id", element: <LootContract /> },
        ],
      },
      {
        path: "/loot/boxes",
        element: <Protected />,
        children: [
          { index: true, element: <LootBox /> },
          { path: "/loot/boxes/:id", element: <LootBox /> },
        ],
      },
      {
        path: "/loot/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <LootToken /> },
          { path: "/loot/tokens/:id", element: <LootToken /> },
        ],
      },
    ],
  },
];
