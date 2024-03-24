import type { RouteObject } from "react-router-dom";

import { RaffleSection } from "../../../dashboard/mechanics/raffle";
import { IndexWrapper } from "../../../index-wrapper";
import { PredictionQuestion } from "./question";

export const predictionRoutes: Array<RouteObject> = [
  {
    path: "/prediction",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="prediction">
            <RaffleSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/prediction/question",
        children: [
          { index: true, element: <PredictionQuestion /> },
          { path: "/prediction/question/:id", element: <PredictionQuestion /> },
        ],
      },
    ],
  },
];
