import {
  DiscreteEventType,
  Erc721EventType,
  Erc998EventType,
  ExchangeEventType,
  PausableEventType,
  WaitListEventType,
} from "@framework/types";

export const eventRouteMapping: Partial<Record<string, Array<string>>> = {
  [Erc721EventType.Transfer]: ["/tokens", "/erc721/tokens", "/erc998/tokens", "/erc1155/tokens", "/mystery/tokens"],
  [ExchangeEventType.ClaimTemplate]: ["/claim"],
  [ExchangeEventType.ClaimToken]: ["/claim"],
  [WaitListEventType.WaitListRewardSet]: ["/wait-list/item"],
  [WaitListEventType.WaitListRewardClaimed]: ["/wait-list/item"],
  [DiscreteEventType.LevelUp]: ["/erc721/tokens/:id/view"],
  [PausableEventType.Paused]: ["/erc721/tokens/:id/view"],
  [PausableEventType.Unpaused]: ["/erc721/tokens/:id/view"],
  [ExchangeEventType.PurchaseMysteryBox]: ["/mystery/tokens"],
  DepositWithdraw: ["/staking/deposits"],
  Lend: ["/rent/tokens"],
  LendMany: ["/rent/tokens"],
  Purchase: ["/tokens"],
  OwnershipTransferred: ["/vesting"],
  WhitelistedChild: ["/erc998/tokens"],
  UnWhitelistedChild: ["/erc998/tokens"],
  [Erc998EventType.ReceivedChild]: ["/erc998/tokens/:id/view"],
  [Erc998EventType.TransferChild]: ["/erc998/tokens/:id/view"],
};
