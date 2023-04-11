import type { RouteObject } from "react-router-dom";

import { Protected } from "@gemunion/common-pages";
import { IndexWrapper } from "../../index-wrapper";
import { WalletSection } from "../../dashboard/exchange/wallet";
import { SystemContracts } from "./balances";
import { SystemPayees } from "./payees";

export const walletRoutes: Array<RouteObject> = [
  {
    path: "/wallet",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="wallet">
            <WalletSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/wallet/balances",
        element: <Protected />,
        children: [
          { index: true, element: <SystemContracts /> },
          { path: "/wallet/balances/:id", element: <SystemContracts /> },
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
