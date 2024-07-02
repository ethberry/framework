export interface IParams {
  externalId: number | string;
  expiresAt: number;
  nonce: Uint8Array;
  extra: string;
  receiver: string;
  referrer: string;
}
