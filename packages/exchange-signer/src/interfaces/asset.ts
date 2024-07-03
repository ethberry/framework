export interface IParams {
  externalId: number | string;
  expiresAt: number;
  nonce: Uint8Array;
  extra: string;
  receiver: string;
  referrer: string;
}

export interface IAsset {
  tokenType: number;
  token: string;
  tokenId: string;
  amount: string;
}
