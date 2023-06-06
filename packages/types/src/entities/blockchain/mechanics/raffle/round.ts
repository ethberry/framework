import type { IIdDateBase } from "@gemunion/types-collection";

import type { IRaffleTicket } from "./ticket";
import { CronExpression } from "../../../common";

export interface IRaffleRound extends IIdDateBase {
  tickets?: Array<IRaffleTicket>;
  roundId: string;
  contractId: number;
  startTimestamp: string;
  endTimestamp: string;
}

export interface IRaffleOption {
  address: string;
  schedule: CronExpression;
  description?: string;
}
