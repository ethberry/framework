import type { RouteObject } from "react-router-dom";

import { erc20Routes } from "./erc20/routes";
import { erc721Routes } from "./erc721/routes";
import { erc998Routes } from "./erc998/routes";
import { erc1155Routes } from "./erc1155/routes";

// prettier-ignore
export const hierarchyRoutes: Array<RouteObject> = [
  ...erc20Routes,
  ...erc721Routes,
  ...erc998Routes,
  ...erc1155Routes,
];
