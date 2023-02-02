import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";
import { IndexWrapper } from "../../index-wrapper";
import { Wallet } from "../../dashboard/integrations/wallet";
import { SystemBalances } from "./balances";
import { SystemPayees } from "./payees";

export const walletRoutes: Array<RouteObject> = [
  {
    path: "/wallet",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="wallet">
            <Wallet />
          </IndexWrapper>
        ),
      },
      {
        path: "/wallet/balances",
        element: <Protected />,
        children: [
          { index: true, element: <SystemBalances /> },
          { path: "/wallet/balances/:id", element: <SystemBalances /> },
        ],
      },
      {
        path: "/wallet/payees",
        element: <Protected />,
        children: [
          { index: true, element: <SystemPayees /> },
          { path: "/wallet/payees/:id", element: <SystemPayees /> },
        ],
      },
    ],
  },
];
