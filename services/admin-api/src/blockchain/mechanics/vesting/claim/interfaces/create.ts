import { IAssetDto, IVestingContractDeployDto } from "@framework/types";

export interface IVestingClaimCreateDto {
  account: string;
  item: IAssetDto;
  endTimestamp: string;
  parameters: IVestingContractDeployDto;
}
