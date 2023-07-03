import type { IIdBase } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { ModuleType } from "../common";

export enum RatePlanType {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
}

export interface IRatePlan extends IIdBase {
  ratePlan: RatePlanType;
  contractModule: ModuleType;
  contractType: TokenType | null;
  amount: number;
}
