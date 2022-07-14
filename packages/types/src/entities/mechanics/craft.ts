import { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../blockchain/asset";
import { IExchangeHistory } from "./exchange-history";

export enum CraftStatus {
  NEW = "NEW",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export interface IRecipe extends IIdDateBase {
  item: IAsset;
  ingredients: IAsset;
  craftStatus: CraftStatus;
  history?: Array<IExchangeHistory>;
}
