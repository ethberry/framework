import { IIdBase } from "@gemunion/types-collection";

import { IErc721Auction } from "./auction";

export enum Erc721AuctionEventType {
  AuctionStart = "AuctionStart",
  AuctionBid = "AuctionBid",
  AuctionFinish = "AuctionFinish",
}

export interface IErc721AuctionStart {
  auctionId: string;
  owner: string;
  collection: string;
  tokenId: string;
  buyoutPrice: string;
  startPrice: string;
  bidStep: string;
  startTimestamp: string;
  finishTimestamp: string;
}

export interface IErc721AuctionBid {
  auctionId: string;
  owner: string;
  collection: string;
  tokenId: string;
  amount: string;
}

export interface IErc721AuctionFinish {
  auctionId: string;
  owner: string;
  collection: string;
  tokenId: string;
  amount: string;
}

export type TErc721AuctionEventData = IErc721AuctionStart | IErc721AuctionBid | IErc721AuctionFinish;

export interface IErc721AuctionHistory extends IIdBase {
  address: string;
  transactionHash: string;
  eventType: Erc721AuctionEventType;
  eventData: TErc721AuctionEventData;
  erc721AuctionId: number | null;
  erc721Auction?: IErc721Auction;
}
