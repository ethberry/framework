import { ContractEventSignature } from "@framework/types";

export const EventRouteMatch: Partial<Record<keyof typeof ContractEventSignature, string>> = {
  Claim: "/claim",
  DepositWithdraw: "/staking/deposits",
  Lend: "/rent/tokens",
  LendMany: "/rent/tokens",
  Purchase: "/tokens",
  OwnershipTransferred: "/vesting",
};
