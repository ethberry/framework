export const eventRouteMapping: Partial<Record<string, Array<string>>> = {
  // DEPLOY
  ERC20TokenDeployed: ["/erc20/contracts"],
  ERC721TokenDeployed: ["/erc721/contracts"],
  ERC998TokenDeployed: ["/erc998/contracts"],
  WhitelistedChild: ["/erc998/composition"],
  UnWhitelistedChild: ["/erc998/composition"],
  ERC1155TokenDeployed: ["/erc1155/contracts"],
  LootBoxDeployed: ["/loot/contracts"],
  MysteryBoxDeployed: ["/mystery/contracts"],
  CollectionDeployed: ["/collection/contracts"],
  PonziDeployed: ["/ponzi/contracts"],
  VestingDeployed: ["/vesting/contracts"],
  StakingDeployed: ["/staking/contracts"],
  LotteryDeployed: ["/lottery/contracts"],
  RaffleDeployed: ["/raffle/contracts"],
  WaitListDeployed: ["/wait-list/contracts"],
  PaymentSplitterDeployed: ["/payment-splitter/contracts"],
  // STAKING RULES
  RuleCreated: ["/staking/rules"],
  RuleUpdated: ["/staking/rules"],
  // ERC20
  Whitelisted: ["/erc20/contracts"],
  UnWhitelisted: ["/erc20/contracts"],
};
