import { VestingContractTemplates } from "../../../../../entities";

export interface IVestingContractDeployDto {
  contractTemplate: VestingContractTemplates;
  name: string;
  symbol: string;
  baseTokenURI: string;
  royalty: number;
}
