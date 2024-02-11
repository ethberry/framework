import type { IIdDateBase } from "@gemunion/types-collection";

import type { IContract } from "../../hierarchy/contract";
import { IAsset } from "../../exchange/asset";
import { IEventHistory } from "../../event-history";
import { IReferralProgram } from "./program";

export interface IReferralReward extends IIdDateBase {
  account: string;
  referrer: string;
  share: number;
  refProgramId: number;
  refProgram: IReferralProgram;
  priceId: number | null;
  price: IAsset;
  itemId: number | null;
  item?: IAsset;
  historyId: number;
  history?: IEventHistory;
  contractId: number | null;
  contract?: IContract;
}
