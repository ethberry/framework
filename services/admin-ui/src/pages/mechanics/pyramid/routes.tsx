import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/firebase-login";

import { PyramidContract } from "./contract";
import { PyramidRules } from "./rules";
import { PyramidReport } from "./report";
import { PyramidChart } from "./chart";
import { IndexWrapper } from "../../index-wrapper";
import { Pyramid } from "../../dashboard/mechanics/pyramid";

export const pyramidRoutes: Array<RouteObject> = [
  {
    path: "/pyramid",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="pyramid">
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
      {
        path: "/pyramid/report",
        element: <Protected />,
        children: [
          { index: true, element: <PyramidReport /> },
          { path: "/pyramid/report", element: <PyramidReport /> },
        ],
      },
      {
        path: "/pyramid/chart",
        element: <Protected />,
        children: [
          { index: true, element: <PyramidChart /> },
          { path: "/pyramid/chart", element: <PyramidChart /> },
        ],
      },
    ],
  },
];
