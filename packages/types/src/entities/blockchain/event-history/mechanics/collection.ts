export enum CollectionEventType {
  ConsecutiveTransfer = "ConsecutiveTransfer",
}

export enum CollectionEventSignature {
  ConsecutiveTransfer = "ConsecutiveTransfer(uint256,uint256,address,address)",
}

export interface ICollectionConsecutiveTransfer {
  fromTokenId: string;
  toTokenId: string;
  fromAddress: string;
  toAddress: string;
}

export type TCollectionEvents = ICollectionConsecutiveTransfer;
