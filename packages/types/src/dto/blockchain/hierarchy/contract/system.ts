import { SystemModuleType } from "../../../../entities";

export interface ISystemContractSearchDto {
  contractModule: SystemModuleType;
  chainId: number;
}
