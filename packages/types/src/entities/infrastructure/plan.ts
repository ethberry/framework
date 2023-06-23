import type { IIdBase } from "@gemunion/types-collection";
import type { TokenType } from "@gemunion/types-blockchain";

import { ModuleType } from "../common";

export enum RatePlan {
  BRONZE = "BRONZE",
  SILVER = "SILVER",
  GOLD = "GOLD",
}

export interface IRatePlan extends IIdBase {
  ratePlan: RatePlan;
  contractModule: ModuleType;
  contractType: TokenType | null;
  amount: number;
}
