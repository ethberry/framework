export enum MobileEventType {
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  PURCHASE = "PURCHASE",
  PURCHASE_RANDOM = "PURCHASE_RANDOM",
  PURCHASE_LOTTERY = "PURCHASE_LOTTERY",
  PURCHASE_RAFFLE = "PURCHASE_RAFFLE",
  PURCHASE_MYSTERY = "PURCHASE_MYSTERY",
  CLAIM = "CLAIM",
  RENT = "RENT",
  RENT_USER = "RENT_USER",
  UPGRADE = "UPGRADE",
  STAKING_DEPOSIT_START = "STAKING_DEPOSIT_START",
  STAKING_DEPOSIT_FINISH = "STAKING_DEPOSIT_FINISH",
  STAKING_RULE_CREATED = "STAKING_RULE_CREATED",
  STAKING_RULE_UPDATED = "STAKING_RULE_UPDATED",
  WAITLIST_REWARD_SET = "WAITLIST_REWARD_SET",
  WAITLIST_REWARD_CLAIMED = "WAITLIST_REWARD_CLAIMED",
}

export interface IMessage {
  from: string;
  to: string;
  value: string;
  transactionHash: string;
}
