export interface IClaimCreateDto {
  itemId: number;
  account: string;
  endTimestamp: string;
  nonce: string;
  signature: string;
  merchantId: number;
}
