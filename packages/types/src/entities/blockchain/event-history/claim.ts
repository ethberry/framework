export interface IClaimUnpack {
  collection: string;
  tokenId: string;
  templateId: string;
  claimId: string;
}

export interface IClaimRedeem {
  from: string;
  collection: string;
  tokenId: string;
  templateId: string;
  price: string;
}

export type TClaimEvents = IClaimUnpack | IClaimRedeem;
