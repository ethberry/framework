export enum Erc721EventType {
  Approval = "Approval",
  Transfer = "Transfer",
  ApprovalForAll = "ApprovalForAll",
}

export enum Erc721EventSignature {
  Approval = "Approval(address,address,uint256)",
  Transfer = "Transfer(address,address,uint256)",
  ApprovalForAll = "ApprovalForAll(address,address,bool)",
}

export interface IERC721TokenTransferEvent {
  from: string;
  to: string;
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

export type TErc721Events = IERC721TokenTransferEvent | IERC721TokenApproveEvent | IERC721TokenApprovedForAllEvent;
