import type { RouteObject } from "react-router-dom";

import { Erc20Section } from "../../dashboard/hierarchy/erc20";
import { IndexWrapper } from "../../index-wrapper";
import { Erc20CoinsList } from "./token-list";

export const erc20Routes: Array<RouteObject> = [
  {
    path: "/erc20",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="erc20">
            <Erc20Section />
          </IndexWrapper>
        ),
      },
      {
        path: "/erc20/coins",
        children: [{ index: true, element: <Erc20CoinsList /> }],
      },
    ],
  },
];
