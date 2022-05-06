export enum MarketplaceTabs {
  heroes = "heroes",
  heroesdb = "heroesdb",
  items = "items",
  itemsdb = "itemsdb",
  resources = "resources",
}

export interface ITabPanelProps {
  value: MarketplaceTabs;
}
