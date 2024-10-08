export enum Erc721EventType {
  Approval = "Approval",
  Transfer = "Transfer",
  ApprovalForAll = "ApprovalForAll",
  MintRandom = "MintRandom",
  ConsecutiveTransfer = "ConsecutiveTransfer",
}

export enum Erc721EventSignature {
  Approval = "Approval(address,address,uint256)",
  Transfer = "Transfer(address,address,uint256)",
  ApprovalForAll = "ApprovalForAll(address,address,bool)",
  MintRandom = "MintRandom(uint256,address,uint256[],uint256,uint256)",
  ConsecutiveTransfer = "ConsecutiveTransfer(uint256,uint256,address,address)",
}

export interface IERC721TokenTransferEvent {
  from: string;
  to: string;
  tokenId: string;
}

export interface IERC721TokenMintRandomEvent {
  requestId: string;
  to: string;
  randomWords: Array<string>;
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
