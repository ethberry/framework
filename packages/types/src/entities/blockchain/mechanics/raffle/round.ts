import type { IIdDateBase } from "@gemunion/types-collection";

import type { IAsset } from "../../exchange/asset";
import type { IContract } from "../../hierarchy/contract";
import type { IToken } from "../../hierarchy/token";
import type { IAssetItem } from "../../event-history";

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
