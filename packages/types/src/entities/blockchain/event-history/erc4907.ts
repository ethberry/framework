export enum Erc4907EventType {
  UpdateUser = "UpdateUser",
}

// event UpdateUser(uint256 indexed tokenId, address indexed user, uint64 expires);
export interface IErc4907UpdateUserEvent {
  tokenId: string;
  user: string;
  expires: string;
}

export type TErc4907Events = IErc4907UpdateUserEvent;
