export enum MarketplaceTabs {
  erc721 = "erc721",
  erc998 = "erc998",
  erc1155 = "erc1155",
  lootbox = "lootbox",
}

export interface ITabPanelProps {
  value: MarketplaceTabs;
}
