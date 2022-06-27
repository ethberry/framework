import { Erc20ContractTemplate } from "../../../entities";

export interface IErc20TokenDeployDto {
  contractTemplate: Erc20ContractTemplate;
  name: string;
  symbol: string;
  cap: string;
}
