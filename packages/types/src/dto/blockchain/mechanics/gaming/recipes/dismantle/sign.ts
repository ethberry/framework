export interface IDismantleSignDto {
  referrer: string;
  dismantleId: number;
  tokenId: number;
  chainId?: number;
  account?: string;
}
