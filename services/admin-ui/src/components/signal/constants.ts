import { ContractManagerEventType } from "@framework/types";

export const EventRouteMatch: Partial<Record<string, string>> = {
  // DEPLOY
  [ContractManagerEventType.ERC20TokenDeployed]: "/erc20/contracts",
  [ContractManagerEventType.ERC721TokenDeployed]: "/erc721/contracts",
  [ContractManagerEventType.ERC998TokenDeployed]: "/erc998/contracts",
  [ContractManagerEventType.ERC1155TokenDeployed]: "/erc1155/contracts",
  [ContractManagerEventType.WaitListDeployed]: "/wait-list/contracts",
  WhitelistedChild: "/erc998/composition",
  UnWhitelistedChild: "/erc998/composition",
  LootBoxDeployed: "/loot/contracts",
  MysteryBoxDeployed: "/mystery/contracts",
  CollectionDeployed: "/collection/contracts",
  PonziDeployed: "/ponzi/contracts",
  VestingDeployed: "/vesting/contracts",
  StakingDeployed: "/staking/contracts",
  LotteryDeployed: "/lottery/contracts",
  RaffleDeployed: "/raffle/contracts",
  PaymentSplitterDeployed: "/payment-splitter/contracts",
  // STAKING RULES
  RuleCreated: "/staking/rules",
  RuleUpdated: "/staking/rules",
  // ERC20
  Whitelisted: "/erc20/contracts",
  UnWhitelisted: "/erc20/contracts",
};
