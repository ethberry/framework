export enum MobileEventType {
  USER_CREATED = "USER_CREATED",
  USER_UPDATED = "USER_UPDATED",

  TOKEN_TRANSFER = "TOKEN_TRANSFER",
  BATCH_TRANSFER = "BATCH_TRANSFER",
  CONSECUTIVE_TRANSFER = "CONSECUTIVE_TRANSFER",

  PURCHASE = "PURCHASE",
  PURCHASE_RANDOM = "PURCHASE_RANDOM",

  LOOT_UNPACK = "LOOT_UNPACK",
  LOOT_PURCHASE = "LOOT_PURCHASE",
  MYSTERY_UNPACK = "MYSTERY_UNPACK",
  MYSTERY_PURCHASE = "MYSTERY_PURCHASE",

  LOTTERY_PURCHASE = "LOTTERY_PURCHASE",
  LOTTERY_PRIZE = "LOTTERY_PRIZE",
  LOTTERY_FINALIZE = "LOTTERY_FINALIZE",
  LOTTERY_ROUND_START = "LOTTERY_ROUND_START",
  LOTTERY_ROUND_END = "LOTTERY_ROUND_END",

  RAFFLE_PURCHASE = "RAFFLE_PURCHASE",
  RAFFLE_PRIZE = "RAFFLE_PRIZE",
  RAFFLE_FINALIZE = "RAFFLE_FINALIZE",
  RAFFLE_ROUND_START = "RAFFLE_ROUND_START",
  RAFFLE_ROUND_END = "RAFFLE_ROUND_END",

  STAKING_DEPOSIT_START = "STAKING_DEPOSIT_START",
  STAKING_DEPOSIT_FINISH = "STAKING_DEPOSIT_FINISH",
  STAKING_RULE_CREATED = "STAKING_RULE_CREATED",
  STAKING_RULE_UPDATED = "STAKING_RULE_UPDATED",
  STAKING_BALANCE_CHECK = "STAKING_BALANCE_CHECK",

  WAITLIST_REWARD_SET = "WAITLIST_REWARD_SET",
  WAITLIST_REWARD_CLAIMED = "WAITLIST_REWARD_CLAIMED",

  CRAFT = "CRAFT",
  DISMANTLE = "DISMANTLE",
  MERGE = "MERGE",

  CLAIM_TEMPLATE = "CLAIM_TEMPLATE",
  CLAIM_TOKEN = "CLAIM_TOKEN",

  RENT = "RENT",
  RENT_USER = "RENT_USER",

  LEVEL_UP = "LEVEL_UP",

  VESTING_RELEASED = "VESTING_RELEASED",

  BREED = "BREED",

  REFERRAL = "REFERRAL",
}

export interface IMessage {
  from: string;
  to: string;
  value: string;
  transactionHash: string;
}
