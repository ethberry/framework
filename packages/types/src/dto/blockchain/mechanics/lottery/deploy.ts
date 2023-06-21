export interface ILotteryContractDeployDto {
  account: string;
  config: ILotteryConfigDto;
}

export interface ILotteryConfigDto {
  timeLagBeforeRelease: number;
  commission: number;
}
