import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { IndexWrapper } from "../../../index-wrapper";
import { PredictionSection } from "../../../dashboard/mechanics/prediction";
import { PredictionQuestions } from "./questions";
import { PredictionAnswers } from "./answers";
import { PredictionContract } from "./contract";

export const predictionRoutes: Array<RouteObject> = [
  {
    path: "/prediction",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="prediction">
            <PredictionSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/prediction/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <PredictionContract /> },
          { path: "/prediction/contracts/:id/:action", element: <PredictionContract /> },
        ],
      },
      {
        path: "/prediction/questions",
        element: <Protected />,
        children: [
          { index: true, element: <PredictionQuestions /> },
          { path: "/prediction/questions/:id/:action", element: <PredictionQuestions /> },
        ],
      },
      {
        path: "/prediction/answers",
        element: <Protected />,
        children: [
          { index: true, element: <PredictionAnswers /> },
          { path: "/prediction/answers/:id", element: <PredictionAnswers /> },
          { path: "/prediction/answers/:id/:action", element: <PredictionAnswers /> },
        ],
      },
    ],
  },
];
