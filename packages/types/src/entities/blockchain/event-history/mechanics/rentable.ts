export enum RentableEventType {
  UpdateUser = "UpdateUser",
}

export enum RentableEventSignature {
  UpdateUser = "UpdateUser(uint256,address,uint64)",
}

export interface IRentableUpdateUserEvent {
  tokenId: bigint;
  user: string;
  expires: string;
}

export type TRentableEvents = IRentableUpdateUserEvent;
