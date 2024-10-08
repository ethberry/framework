export interface IRaffleConfig {
  timeLagBeforeRelease: string;
  commission: string;
}

export interface IRaffleDeployedEventArgs {
  config: IRaffleConfig;
}

export interface IContractManagerRaffleDeployedEvent {
  account: string;
  externalId: number;
}
