import { IIdBase } from "@gemunion/types-collection";

import { IErc721Collection } from "./collection";
import { IErc721Token } from "./token";
import { IErc721AuctionHistory } from "./auction-history";

export enum Erc721AuctionStatus {
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

export interface IErc721Auction extends IIdBase {
  auctionId: string;
  owner: string;
  erc721CollectionId: number;
  erc721Collection?: IErc721Collection;
  erc721TokenId: number;
  erc721Token?: IErc721Token;
  startPrice: string;
  buyoutPrice: string;
  price: string;
  bidStep: string;
  startTimestamp: string;
  finishTimestamp: string;
  auctionStatus: Erc721AuctionStatus;
  history?: Array<IErc721AuctionHistory>;
}
