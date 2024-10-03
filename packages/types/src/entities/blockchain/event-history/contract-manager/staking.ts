export interface IStakingDeployedEventArgs {
  contractTemplate: string;
}

export interface IContractManagerStakingDeployedEvent {
  account: string;
  externalId: number;
  args: IStakingDeployedEventArgs;
}
