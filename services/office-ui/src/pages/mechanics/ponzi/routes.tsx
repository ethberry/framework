import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { PonziContract } from "./contract";
import { PonziRules } from "./rules";
import { PonziReport } from "./report";
import { PonziChart } from "./chart";
import { IndexWrapper } from "../../index-wrapper";
import { PonziSection } from "../../dashboard/mechanics/ponzi";

export const ponziRoutes: Array<RouteObject> = [
  {
    path: "/ponzi",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="ponzi">
            <PonziSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/ponzi/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <PonziContract /> },
          { path: "/ponzi/contracts/:id", element: <PonziContract /> },
        ],
      },
      {
        path: "/ponzi/rules",
        element: <Protected />,
        children: [
          { index: true, element: <PonziRules /> },
          { path: "/ponzi/rules/:id", element: <PonziRules /> },
        ],
      },
      {
        path: "/ponzi/report",
        element: <Protected />,
        children: [
          { index: true, element: <PonziReport /> },
          { path: "/ponzi/report", element: <PonziReport /> },
        ],
      },
      {
        path: "/ponzi/chart",
        element: <Protected />,
        children: [
          { index: true, element: <PonziChart /> },
          { path: "/ponzi/chart", element: <PonziChart /> },
        ],
      },
    ],
  },
];
