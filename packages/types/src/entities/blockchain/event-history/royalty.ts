export interface IDefaultRoyaltyInfoEvent {
  royaltyReceiver: string;
  royaltyNumerator: string;
}

export interface ITokenRoyaltyInfoEvent {
  tokenId: string;
  royaltyReceiver: string;
  royaltyNumerator: boolean;
}

export type TRoyaltyEvents = IDefaultRoyaltyInfoEvent | ITokenRoyaltyInfoEvent;
