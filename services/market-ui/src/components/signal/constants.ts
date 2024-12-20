import type { ContractEventSignature } from "@framework/types";

export const EventRouteMatch: Partial<Record<keyof typeof ContractEventSignature, string>> = {
  Claim: "/claim",
  DepositWithdraw: "/staking/deposits",
  Lend: "/rent/tokens",
  LendMany: "/rent/tokens",
  Purchase: "/tokens",
  OwnershipTransferred: "/vesting",
  WhitelistedChild: "/erc998/tokens",
  UnWhitelistedChild: "/erc998/tokens",
  ReceivedChild: "/erc998/tokens",
  TransferChild: "/erc998/tokens",
};
