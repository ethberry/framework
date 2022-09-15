import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { Pyramid } from "../../dashboard/mechanics/pyramid";
import { PyramidContract } from "./contract";
import { PyramidRules } from "./rules";
import { IndexWrapper } from "../../index-wrapper";

export const pyramidRoutes: Array<RouteObject> = [
  {
    path: "/pyramid",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="staking">
            <Pyramid />
          </IndexWrapper>
        ),
      },
      {
        path: "/pyramid/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <PyramidContract /> },
          { path: "/pyramid/contracts/:id", element: <PyramidContract /> },
        ],
      },
      {
        path: "/pyramid/rules",
        element: <Protected />,
        children: [
          { index: true, element: <PyramidRules /> },
          { path: "/pyramid/rules/:id", element: <PyramidRules /> },
        ],
      },
    ],
  },
  // {
  //   path: "/pyramid-contracts",
  //   element: <Protected />,
  //   children: [
  //     { index: true, element: <PyramidContract /> },
  //     { path: "/pyramid-contracts/:id", element: <PyramidContract /> },
  //   ],
  // },
  // {
  //   path: "/pyramid/rules",
  //   element: <Protected />,
  //   children: [
  //     { index: true, element: <PyramidRules /> },
  //     { path: "/pyramid/rules/:id", element: <PyramidRules /> },
  //   ],
  // },
];
