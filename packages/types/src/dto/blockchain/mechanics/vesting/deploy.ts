export interface IVestingContractDeployDto {
  account: string;
  startTimestamp: string;
  cliffInMonth: number;
  monthlyRelease: number;
}
