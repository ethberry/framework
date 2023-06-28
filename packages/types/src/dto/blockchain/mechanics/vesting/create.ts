import { IAssetDto } from "../../exchange/asset/asset";
import { IVestingContractDeployDto } from "./deploy";

export interface IVestingClaimCreateDto {
  item: IAssetDto;
  // endTimestamp: string;
  parameters: IVestingContractDeployDto;
}
