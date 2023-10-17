import type { IAssetDto } from "../../exchange/asset/asset";
import type { IVestingContractDeployDto } from "./deploy";

export interface IVestingClaimCreateDto {
  item: IAssetDto;
  // endTimestamp: string;
  parameters: IVestingContractDeployDto;
}
