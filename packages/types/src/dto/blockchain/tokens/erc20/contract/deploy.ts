import { Erc20ContractTemplates } from "../../../../../entities";

export interface IErc20TokenDeployDto {
  contractTemplate: Erc20ContractTemplates;
  name: string;
  symbol: string;
  cap: string;
}
