import type { IIdDateBase } from "@gemunion/types-collection";

import type { IRaffleTicket } from "./ticket";
import { CronExpression } from "../../../common";

export interface IRaffleRound extends IIdDateBase {
  tickets?: Array<IRaffleTicket>;
  roundId: string;
  contractId: number;
  maxTickets: number;
  number: string | null; // winner
  startTimestamp: string;
  endTimestamp: string;
}

export interface IRaffleOption {
  address: string;
  schedule: CronExpression;
  description?: string;
}
