export interface IRaffleContractDeployDto {
  config: IRaffleConfigDto;
}

export interface IRaffleConfigDto {
  timeLagBeforeRelease: number;
  commission: number;
}
