export enum MobileEventType {
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  PURCHASE = "PURCHASE",
  CLAIM = "CLAIM",
  RENT = "RENT",
  RENT_USER = "RENT_USER",
  UPGRADE = "UPGRADE",
  STAKING_START = "STAKING_START",
  STAKING_FINISH = "STAKING_FINISH",
}

export interface IMessage {
  from: string;
  to: string;
  value: string;
  transactionHash: string;
}
