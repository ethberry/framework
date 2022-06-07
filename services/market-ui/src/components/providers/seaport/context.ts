import { createContext } from "react";
import { Fee, OrderWithNonce } from "@bthn/seaport-js/lib/types";

export interface IAuctionOptions {
  startDate?: string;
  endDate?: string;
  nonce: number;
}

export interface IErc20 {
  address: string;
  minAmount: string;
  maxAmount?: string;
}

export interface IErc721 {
  address: string;
  tokenId: string;
}

export interface IErc1155 {
  address: string;
  tokenId: string;
  amount: string;
}

export interface ISeaportContext {
  getNonce: (address: string) => Promise<number>;
  bulkCancelOrders: () => Promise<void>;
  calculateRoyalty: (erc721: IErc721) => Promise<Fee>;
  sellErc721ForErc20: (options: IAuctionOptions, erc721: IErc721, erc20: IErc20) => Promise<OrderWithNonce>;
  sellErc1155ForErc20: (options: IAuctionOptions, erc1155: IErc1155, erc20: IErc20) => Promise<OrderWithNonce>;
}

export const SeaportContext = createContext<ISeaportContext>(undefined!);
