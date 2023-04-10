import type { IIdDateBase } from "@gemunion/types-collection";

import { IContract } from "../../hierarchy/contract";
import { IAsset } from "../../exchange/asset";

export enum RentStrategy {
  SHARE25 = "SHARE25",
  SHARE50 = "SHARE50",
  SHARE75 = "SHARE75",
}

export interface IRent extends IIdDateBase {
  contractId: number;
  contract?: IContract;
  price?: IAsset;
}
