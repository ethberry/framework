import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../index-wrapper";
import { Erc998Section } from "../../dashboard/hierarchy/erc998";
import { Erc998Contract } from "./contract";
import { Erc998Template } from "./template";
import { Erc998Token } from "./token";
import { Erc998Composition } from "./composition";

export const erc998Routes: Array<RouteObject> = [
  {
    path: "/erc998",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="erc998">
            <Erc998Section />
          </IndexWrapper>
        ),
      },
      {
        path: "/erc998/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <Erc998Contract /> },
          { path: "/erc998/contracts/:id/:action", element: <Erc998Contract /> },
        ],
      },
      {
        path: "/erc998/templates",
        element: <Protected />,
        children: [
          { index: true, element: <Erc998Template /> },
          { path: "/erc998/templates/:id/:action", element: <Erc998Template /> },
        ],
      },
      {
        path: "/erc998/tokens",
        element: <Protected />,
        children: [
          { index: true, element: <Erc998Token /> },
          { path: "/erc998/tokens/:id/:action", element: <Erc998Token /> },
        ],
      },
      {
        path: "/erc998/composition",
        element: <Protected />,
        children: [
          { index: true, element: <Erc998Composition /> },
          { path: "/erc998/composition/:id/:action", element: <Erc998Composition /> },
        ],
      },
    ],
  },
];
