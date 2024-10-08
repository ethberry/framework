export enum RoyaltyEventType {
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo",
  TokenRoyaltyInfo = "TokenRoyaltyInfo",
}

export enum RoyaltyEventSignature {
  DefaultRoyaltyInfo = "DefaultRoyaltyInfo(address,uint96)",
  TokenRoyaltyInfo = "TokenRoyaltyInfo(uint256,address,uint96)",
}

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
