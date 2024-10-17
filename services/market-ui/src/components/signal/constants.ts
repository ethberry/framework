import { Erc721EventType, ExchangeEventType, WaitListEventType } from "@framework/types";

export const eventRouteMapping: Partial<Record<string, Array<string>>> = {
  [Erc721EventType.Transfer]: ["/tokens", "/erc721/tokens", "/erc998/tokens"],
  [ExchangeEventType.ClaimTemplate]: ["/claim"],
  [ExchangeEventType.ClaimToken]: ["/claim"],
  [WaitListEventType.WaitListRewardSet]: ["/wait-list/item"],
  [WaitListEventType.WaitListRewardClaimed]: ["/wait-list/item"],
  DepositWithdraw: ["/staking/deposits"],
  Lend: ["/rent/tokens"],
  LendMany: ["/rent/tokens"],
  Purchase: ["/tokens"],
  OwnershipTransferred: ["/vesting"],
  WhitelistedChild: ["/erc998/tokens"],
  UnWhitelistedChild: ["/erc998/tokens"],
  ReceivedChild: ["/erc998/tokens"],
  TransferChild: ["/erc998/tokens"],
};
