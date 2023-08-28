import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { Erc20Contract } from "./contract";
import { IndexWrapper } from "../../index-wrapper";
import { Erc20Section } from "../../dashboard/hierarchy/erc20";

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
        path: "/erc20/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <Erc20Contract /> },
          { path: "/erc20/contracts/:id", element: <Erc20Contract /> },
        ],
      },
    ],
  },
];
