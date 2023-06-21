export interface IVestingContractDeployDto {
  beneficiary: string;
  startTimestamp: string;
  cliffInMonth: number;
  monthlyRelease: number;
}
