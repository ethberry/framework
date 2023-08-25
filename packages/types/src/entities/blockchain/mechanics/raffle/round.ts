import type { IIdDateBase } from "@gemunion/types-collection";

import { IAsset } from "../../exchange/asset";
import { IContract } from "../../hierarchy/contract";
import { IToken } from "../../hierarchy/token";
import { IAssetItem } from "../../event-history";

export interface IRaffleRound extends IIdDateBase {
  number: string | null; // winner
  tickets?: Array<IToken>;
  roundId: string;
  contractId: number; // lottery contract
  ticketContractId: number; // ticket contract
  priceId: number;
  price?: IAsset;
  maxTickets: number;
  startTimestamp: string;
  endTimestamp: string;
  contract?: IContract;
  ticketContract?: IContract;
}

export interface IRaffleCurrentRound {
  roundId: string;
  startTimestamp: string;
  endTimestamp: string;
  maxTicket: string;
  prizeNumber: string; // prize number
  acceptedAsset: IAssetItem;
  ticketAsset: IAssetItem;
}
