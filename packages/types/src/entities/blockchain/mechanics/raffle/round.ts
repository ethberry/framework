import type { IIdDateBase } from "@gemunion/types-collection";

import type { IRaffleTicket } from "./ticket";
import { CronExpression } from "../../../common";
import { IAsset } from "../../exchange/asset";
import { IContract } from "../../hierarchy/contract";

export interface IRaffleRound extends IIdDateBase {
  number: string | null; // winner
  tickets?: Array<IRaffleTicket>;
  roundId: string;
  contractId: number; // lottery contract
  ticketContractId: number; // ticket contract
  priceId: number;
  maxTickets: number;
  startTimestamp: string;
  endTimestamp: string;
  contract?: IContract;
  ticketContract?: IContract;
  price?: IAsset;
}

export interface IRaffleOption {
  address: string;
  schedule: CronExpression;
  description?: string;
}
