import { IAssetDto } from "@framework/types";

export interface ITokenSellDto {
  chainId: number;
  account: string;
  referrer: string;
  tokenId: number;
  amount: string;
  price: IAssetDto;
  endTimestamp: string;
}
