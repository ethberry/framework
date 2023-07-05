import type { RouteObject } from "react-router-dom";

import { MarketplaceSection } from "../../dashboard/exchange/marketplace";
import { IndexWrapper } from "../../index-wrapper";
import { MerchantList } from "./merchant-list";
import { Merchant } from "./merchant";
import { ContractList } from "./contract-list";
import { Contract } from "./contract";
import { TemplateList } from "./template-list";
import { Template } from "./template";

export const marketplaceRoutes: Array<RouteObject> = [
  {
    path: "/marketplace",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="marketplace">
            <MarketplaceSection />
          </IndexWrapper>
        ),
      },
      {
        path: "/marketplace/merchants",
        children: [
          { index: true, element: <MerchantList /> },
          { path: "/marketplace/merchants/:id", element: <Merchant /> },
        ],
      },
      {
        path: "/marketplace/contracts",
        children: [
          { index: true, element: <ContractList /> },
          { path: "/marketplace/contracts/:id", element: <Contract /> },
        ],
      },
      {
        path: "/marketplace/templates",
        children: [
          { index: true, element: <TemplateList /> },
          { path: "/marketplace/templates/:id", element: <Template /> },
        ],
      },
    ],
  },
];
