export interface IRaffleContractDeployDto {
  account: string;
  config: IRaffleConfigDto;
}

export interface IRaffleConfigDto {
  timeLagBeforeRelease: number;
  commission: number;
}
