import { IIdDateBase } from "@gemunion/types-collection";

import { ICraft } from "./craft";
import { ITemplate } from "../blockchain/hierarchy/template";
import { IClaim } from "./claim";
import { IGrade } from "./grade";
import { ILootbox } from "./lootbox";

export enum ExchangeEventType {
  Claim = "Claim",
  Craft = "Craft",
  Lootbox = "Lootbox",
  Purchase = "Purchase",
  Upgrade = "Upgrade",
}

// TODO describe all events

type IExchangeItem = [number, string, string, string];

export interface IExchangePurchase {
  from: string;
  externalId: string;
  item: IExchangeItem;
  ingredients: Array<IExchangeItem>;
}

// MODULE:CLAIM
export interface IExchangeClaim {
  from: string;
  externalId: string;
  items: IExchangeItem;
}

// MODULE:CRAFT
export interface IExchangeCraft {
  from: string;
  externalId: string;
  items: Array<IExchangeItem>;
  ingredients: Array<IExchangeItem>;
}

// MODULE:GRADE
export interface IExchangeGrade {
  from: string;
  externalId: string;
  items: IExchangeItem;
  ingredients: Array<IExchangeItem>;
}

// MODULE:LOOTBOX
export interface IExchangeLootbox {
  from: string;
  externalId: string;
  items: IExchangeItem;
  ingredients: Array<IExchangeItem>;
}

export type TExchangeEventData =
  | IExchangePurchase
  | IExchangeClaim
  | IExchangeCraft
  | IExchangeGrade
  | IExchangeLootbox;

export interface IExchangeHistory extends IIdDateBase {
  address: string;
  transactionHash: string;
  eventType: ExchangeEventType;
  eventData: TExchangeEventData;
  templateId: number | null;
  template?: ITemplate;
  claimId: number | null;
  claim?: IClaim;
  craftId: number | null;
  craft?: ICraft;
  gradeId: number | null;
  grade?: IGrade;
  lootboxId: number | null;
  lootbox?: ILootbox;
}
