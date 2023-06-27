import { IAssetDto, IVestingContractDeployDto } from "@framework/types";

export interface IVestingClaimCreateDto {
  item: IAssetDto;
  // endTimestamp: string;
  parameters: IVestingContractDeployDto;
}
