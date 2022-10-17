export interface IAsset {
  tokenType: number;
  token: string;
  tokenId: string;
  amount: string;
}

export interface IParams {
  nonce: Uint8Array;
  externalId: number | string;
  expiresAt: number;
  referrer: string;
}
