export interface ILotteryContractDeployDto {
  config: ILotteryConfigDto;
}

export interface ILotteryConfigDto {
  timeLagBeforeRelease: number;
  commission: number;
}
