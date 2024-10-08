export enum Erc4907EventType {
  UpdateUser = "UpdateUser",
}

export enum Erc4907EventSignature {
  UpdateUser = "UpdateUser(uint256,address,uint64)",
}

// event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);
export interface IErc4907UpdateUserEvent {
  tokenId: string;
  user: string;
  expires: string;
}

export type TErc4907Events = IErc4907UpdateUserEvent;
