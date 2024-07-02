import type { RouteObject } from "react-router-dom";

import { MysteryContractList } from "./contract-list";
import { MysteryContract } from "./contract";
import { MysteryBoxList } from "./box-list";
import { MysteryBox } from "./box";
import { MysteryTokenList } from "./token-list";
import { MysteryBoxToken } from "./token";
import { IndexWrapper } from "../../../index-wrapper";
import { MysterySection } from "../../../dashboard/mechanics/mystery";

export const mysteryRoutes: Array<RouteObject> = [
  {
    path: "/mystery",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="mystery">
            <MysterySection />
          </IndexWrapper>
        ),
      },
      {
        path: "/mystery/contracts",
        children: [
          { index: true, element: <MysteryContractList /> },
          { path: "/mystery/contracts/:id/:action", element: <MysteryContract /> },
        ],
      },
      {
        path: "/mystery/boxes",
        children: [
          { index: true, element: <MysteryBoxList /> },

          { path: "/mystery/boxes/:id/:action", element: <MysteryBox /> },
        ],
      },
      {
        path: "/mystery/tokens",
        children: [
          { index: true, element: <MysteryTokenList /> },

          { path: "/mystery/tokens/:id/:action", element: <MysteryBoxToken /> },
        ],
      },
    ],
  },
];
