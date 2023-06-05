import type { IIdDateBase } from "@gemunion/types-collection";

import type { IRaffleTicket } from "./ticket";
import { CronExpression } from "../../../common";

export interface IRaffleRound extends IIdDateBase {
  numbers: Array<boolean>;
  tickets?: Array<IRaffleTicket>;
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
}

export interface IRaffleOption {
  schedule: CronExpression;
  description?: string;
}
