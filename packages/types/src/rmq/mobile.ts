export enum MobileEventType {
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",
  PURCHASE = "PURCHASE",
  PRIZE_LOTTERY = "PRIZE_LOTTERY",
  PRIZE_RAFFLE = "PRIZE_RAFFLE",
  FINALIZE_RAFFLE = "FINALIZE_RAFFLE",
  FINALIZE_LOTTERY = "FINALIZE_LOTTERY",
  PURCHASE_RANDOM = "PURCHASE_RANDOM",
  PURCHASE_LOTTERY = "PURCHASE_LOTTERY",
  PURCHASE_RAFFLE = "PURCHASE_RAFFLE",
  PURCHASE_MYSTERY = "PURCHASE_MYSTERY",
  LOTTERY_ROUND_START = "LOTTERY_ROUND_START",
  RAFFLE_ROUND_START = "RAFFLE_ROUND_START",
  LOTTERY_ROUND_END = "LOTTERY_ROUND_END",
  RAFFLE_ROUND_END = "RAFFLE_ROUND_END",
  CLAIM = "CLAIM",
  CRAFT = "CRAFT",
  DISMANTLE = "DISMANTLE",
  RENT = "RENT",
  RENT_USER = "RENT_USER",
  UPGRADE = "UPGRADE",
  STAKING_DEPOSIT_START = "STAKING_DEPOSIT_START",
  STAKING_DEPOSIT_FINISH = "STAKING_DEPOSIT_FINISH",
  STAKING_RULE_CREATED = "STAKING_RULE_CREATED",
  STAKING_RULE_UPDATED = "STAKING_RULE_UPDATED",
  WAITLIST_REWARD_SET = "WAITLIST_REWARD_SET",
  WAITLIST_REWARD_CLAIMED = "WAITLIST_REWARD_CLAIMED",
  VESTING_RELEASED = "VESTING_RELEASED",
  TOKEN_TRANSFER = "TOKEN_TRANSFER",
  BATCH_TRANSFER = "BATCH_TRANSFER",
  BREED = "BREED",
}

export interface IMessage {
  from: string;
  to: string;
  value: string;
  transactionHash: string;
}
