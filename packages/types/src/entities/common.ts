export enum TokenRarity {
  COMMON = "COMMON",
  UNCOMMON = "UNCOMMON",
  RARE = "RARE",
  EPIC = "EPIC",
  LEGENDARY = "LEGENDARY",
}

export enum EventSignature {
  MintRandom = "MintRandom(uint256,address,uint256[],uint256,uint256)",
  Transfer = "Transfer(address,address,uint256)",
}

export enum EventSignatureHash {
  MintRandom = "0xa29d42f2e56701221b7574eaf57e07a4bdd20605c2bdbe1d244c9e9ddd255e00",
  Transfer = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef",
}

export enum TokenMintType {
  MintRandom = "MintRandom",
  MintCommon = "MintCommon",
}

export enum ModuleType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  EXCHANGE = "EXCHANGE",
  DISPENSER = "DISPENSER",
  CHAIN_LINK = "CHAIN_LINK",
  HIERARCHY = "HIERARCHY",
  COLLECTION = "COLLECTION",
  MYSTERY = "MYSTERY",
  WRAPPER = "WRAPPER",
  LOTTERY = "LOTTERY",
  RAFFLE = "RAFFLE",
  PONZI = "PONZI",
  VESTING = "VESTING",
  POLYGON = "POLYGON",
  STAKING = "STAKING",
  WAIT_LIST = "WAIT_LIST",
  PAYMENT_SPLITTER = "PAYMENT_SPLITTER",
}

export enum ListenerType {
  ERC20 = "ERC20",
  ERC721 = "ERC721",
  ERC721_RANDOM = "ERC721_RANDOM",
  ERC998 = "ERC998",
  ERC998_RANDOM = "ERC998_RANDOM",
  ERC1155 = "ERC1155",
  MYSTERYBOX = "MYSTERYBOX",
  VESTING = "VESTING",
  STAKING = "STAKING",
  PONZI = "PONZI",
  PAYMENT_SPLITTER = "PAYMENT_SPLITTER",
  LOTTERY = "LOTTERY",
  LOTTERY_TICKET = "LOTTERY_TICKET",
  RAFFLE = "RAFFLE",
  RAFFLE_TICKET = "RAFFLE_TICKET",
  WAIT_LIST = "WAIT_LIST",
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  CHAIN_LINK = "CHAIN_LINK",
}

export enum SystemModuleType {
  CONTRACT_MANAGER = "CONTRACT_MANAGER",
  EXCHANGE = "EXCHANGE",
  DISPENSER = "DISPENSER",
  CHAIN_LINK = "CHAIN_LINK", // VRF
}

export enum DurationUnit {
  YEAR = "YEAR",
  MONTH = "MONTH",
  WEEK = "WEEK",
  DAY = "DAY",
  HOUR = "HOUR",
  MINUTE = "MINUTE",
}

export enum CronExpression {
  EVERY_SECOND = "* * * * * *",
  EVERY_5_SECONDS = "*/5 * * * * *",
  EVERY_10_SECONDS = "*/10 * * * * *",
  EVERY_30_SECONDS = "*/30 * * * * *",
  EVERY_MINUTE = "*/1 * * * *",
  EVERY_5_MINUTES = "0 */5 * * * *",
  EVERY_10_MINUTES = "0 */10 * * * *",
  EVERY_30_MINUTES = "0 */30 * * * *",
  EVERY_HOUR = "0 0-23/1 * * *",
  EVERY_2_HOURS = "0 0-23/2 * * *",
  EVERY_3_HOURS = "0 0-23/3 * * *",
  EVERY_4_HOURS = "0 0-23/4 * * *",
  EVERY_5_HOURS = "0 0-23/5 * * *",
  EVERY_6_HOURS = "0 0-23/6 * * *",
  EVERY_7_HOURS = "0 0-23/7 * * *",
  EVERY_8_HOURS = "0 0-23/8 * * *",
  EVERY_9_HOURS = "0 0-23/9 * * *",
  EVERY_10_HOURS = "0 0-23/10 * * *",
  EVERY_11_HOURS = "0 0-23/11 * * *",
  EVERY_12_HOURS = "0 0-23/12 * * *",
  EVERY_DAY_AT_1AM = "0 01 * * *",
  EVERY_DAY_AT_2AM = "0 02 * * *",
  EVERY_DAY_AT_3AM = "0 03 * * *",
  EVERY_DAY_AT_4AM = "0 04 * * *",
  EVERY_DAY_AT_5AM = "0 05 * * *",
  EVERY_DAY_AT_6AM = "0 06 * * *",
  EVERY_DAY_AT_7AM = "0 07 * * *",
  EVERY_DAY_AT_8AM = "0 08 * * *",
  EVERY_DAY_AT_9AM = "0 09 * * *",
  EVERY_DAY_AT_10AM = "0 10 * * *",
  EVERY_DAY_AT_11AM = "0 11 * * *",
  EVERY_DAY_AT_NOON = "0 12 * * *",
  EVERY_DAY_AT_1PM = "0 13 * * *",
  EVERY_DAY_AT_2PM = "0 14 * * *",
  EVERY_DAY_AT_3PM = "0 15 * * *",
  EVERY_DAY_AT_4PM = "0 16 * * *",
  EVERY_DAY_AT_5PM = "0 17 * * *",
  EVERY_DAY_AT_6PM = "0 18 * * *",
  EVERY_DAY_AT_7PM = "0 19 * * *",
  EVERY_DAY_AT_8PM = "0 20 * * *",
  EVERY_DAY_AT_9PM = "0 21 * * *",
  EVERY_DAY_AT_10PM = "0 22 * * *",
  EVERY_DAY_AT_11PM = "0 23 * * *",
  EVERY_DAY_AT_MIDNIGHT = "0 0 * * *",
  EVERY_WEEK = "0 0 * * 0",
  EVERY_WEEKDAY = "0 0 * * 1-5",
  EVERY_WEEKEND = "0 0 * * 6,0",
  EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT = "0 0 1 * *",
  EVERY_1ST_DAY_OF_MONTH_AT_NOON = "0 12 1 * *",
  EVERY_2ND_HOUR = "0 */2 * * *",
  EVERY_2ND_HOUR_FROM_1AM_THROUGH_11PM = "0 1-23/2 * * *",
  EVERY_2ND_MONTH = "0 0 1 */2 *",
  EVERY_QUARTER = "0 0 1 */3 *",
  EVERY_6_MONTHS = "0 0 1 */6 *",
  EVERY_YEAR = "0 0 1 1 *",
  EVERY_30_MINUTES_BETWEEN_9AM_AND_5PM = "0 */30 9-17 * * *",
  EVERY_30_MINUTES_BETWEEN_9AM_AND_6PM = "0 */30 9-18 * * *",
  EVERY_30_MINUTES_BETWEEN_10AM_AND_7PM = "0 */30 10-19 * * *",
  MONDAY_TO_FRIDAY_AT_1AM = "0 0 01 * * 1-5",
  MONDAY_TO_FRIDAY_AT_2AM = "0 0 02 * * 1-5",
  MONDAY_TO_FRIDAY_AT_3AM = "0 0 03 * * 1-5",
  MONDAY_TO_FRIDAY_AT_4AM = "0 0 04 * * 1-5",
  MONDAY_TO_FRIDAY_AT_5AM = "0 0 05 * * 1-5",
  MONDAY_TO_FRIDAY_AT_6AM = "0 0 06 * * 1-5",
  MONDAY_TO_FRIDAY_AT_7AM = "0 0 07 * * 1-5",
  MONDAY_TO_FRIDAY_AT_8AM = "0 0 08 * * 1-5",
  MONDAY_TO_FRIDAY_AT_9AM = "0 0 09 * * 1-5",
  MONDAY_TO_FRIDAY_AT_09_30AM = "0 30 09 * * 1-5",
  MONDAY_TO_FRIDAY_AT_10AM = "0 0 10 * * 1-5",
  MONDAY_TO_FRIDAY_AT_11AM = "0 0 11 * * 1-5",
  MONDAY_TO_FRIDAY_AT_11_30AM = "0 30 11 * * 1-5",
  MONDAY_TO_FRIDAY_AT_12PM = "0 0 12 * * 1-5",
  MONDAY_TO_FRIDAY_AT_1PM = "0 0 13 * * 1-5",
  MONDAY_TO_FRIDAY_AT_2PM = "0 0 14 * * 1-5",
  MONDAY_TO_FRIDAY_AT_3PM = "0 0 15 * * 1-5",
  MONDAY_TO_FRIDAY_AT_4PM = "0 0 16 * * 1-5",
  MONDAY_TO_FRIDAY_AT_5PM = "0 0 17 * * 1-5",
  MONDAY_TO_FRIDAY_AT_6PM = "0 0 18 * * 1-5",
  MONDAY_TO_FRIDAY_AT_7PM = "0 0 19 * * 1-5",
  MONDAY_TO_FRIDAY_AT_8PM = "0 0 20 * * 1-5",
  MONDAY_TO_FRIDAY_AT_9PM = "0 0 21 * * 1-5",
  MONDAY_TO_FRIDAY_AT_10PM = "0 0 22 * * 1-5",
  MONDAY_TO_FRIDAY_AT_11PM = "0 0 23 * * 1-5",
}
