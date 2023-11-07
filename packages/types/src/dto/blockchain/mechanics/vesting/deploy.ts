export interface IVestingContractDeployDto {
  owner: string;
  startTimestamp: string;
  cliffInMonth: number;
  monthlyRelease: number;
  externalId?: string;
}
