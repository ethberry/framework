import type { IIdDateBase } from "@gemunion/types-collection";
import { IExchangeHistory } from "../exchange-history";
import { IBreed } from "./breed";

export interface IBreedHistory extends IIdDateBase {
  account: string;
  childId: number | null;
  child?: IBreed;
  matronId: number;
  matron: IBreed;
  sireId: number;
  sire: IBreed;
  historyId: number;
  history?: IExchangeHistory;
}
