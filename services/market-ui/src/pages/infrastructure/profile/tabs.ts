export enum ProfileTabs {
  general = "general",
  subscriptions = "subscriptions",
  addresses = "addresses",
}

export interface ITabPanelProps {
  value: ProfileTabs;
}
