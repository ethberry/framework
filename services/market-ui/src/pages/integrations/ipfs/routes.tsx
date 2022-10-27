import type { RouteObject } from "react-router-dom";

import { Pinata } from "./pinata";
import { Infura } from "./infura";
import { Web3Storage } from "./web3-storage";
import { NftStorage } from "./nft-storage";

import { IndexWrapper } from "../../index-wrapper";
import { Ipfs } from "../../dashboard/integrations/ipfs";

export const ipfsRoutes: Array<RouteObject> = [
  {
    path: "/ipfs",
    children: [
      {
        index: true,
        element: (
          <IndexWrapper index="ipfs">
            <Ipfs />
          </IndexWrapper>
        ),
      },
      {
        path: "/ipfs/infura",
        children: [{ index: true, element: <Infura /> }],
      },
      {
        path: "/ipfs/pinata",
        children: [{ index: true, element: <Pinata /> }],
      },
      {
        path: "/ipfs/web3storage",
        children: [{ index: true, element: <Web3Storage /> }],
      },
      {
        path: "/ipfs/nftstorage",
        children: [{ index: true, element: <NftStorage /> }],
      },
    ],
  },
];
