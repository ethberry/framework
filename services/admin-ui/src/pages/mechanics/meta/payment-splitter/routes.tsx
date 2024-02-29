import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";

import { PaymentSplitterSection } from "../../../dashboard/mechanics/payment-splitter";
import { IndexWrapper } from "../../../index-wrapper";
import { PaymentSplitterContracts } from "./contract";

export const paymentSplitterRoutes: Array<RouteObject> = [
  {
    path: "/payment-splitter",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="payment-splitter">
            <PaymentSplitterSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/payment-splitter/contracts",
        element: <Protected />,
        children: [
          { index: true, element: <PaymentSplitterContracts /> },
          { path: "/payment-splitter/contracts/:id", element: <PaymentSplitterContracts /> },
        ],
      },
    ],
  },
];
