import type { IIdDateBase } from "@gemunion/types-collection";

import { IContract } from "../../hierarchy/contract";
import { IAsset } from "../../exchange/asset";

export interface IRent extends IIdDateBase {
  contractId: number;
  contract?: IContract;
  price?: IAsset;
}
