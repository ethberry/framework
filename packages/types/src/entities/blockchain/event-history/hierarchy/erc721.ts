export interface IERC721TokenTransferEvent {
  from: string;
  to: string;
  tokenId: string;
}

export interface IERC721TokenMintRandomEvent {
  requestId: string;
  to: string;
  randomness: string;
  templateId: string;
  tokenId: string;
}

export interface IERC721TokenApproveEvent {
  owner: string;
  approved: string;
  tokenId: string;
}

export interface IERC721TokenApprovedForAllEvent {
  owner: string;
  operator: string;
  approved: boolean;
}

export interface IERC721ConsecutiveTransfer {
  fromTokenId: string;
  toTokenId: string;
  fromAddress: string;
  toAddress: string;
}

export type TErc721Events =
  | IERC721TokenTransferEvent
  | IERC721TokenMintRandomEvent
  | IERC721TokenApproveEvent
  | IERC721TokenApprovedForAllEvent
  | IERC721ConsecutiveTransfer;
