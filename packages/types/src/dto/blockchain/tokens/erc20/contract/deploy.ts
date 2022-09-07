import { Erc20ContractFeatures } from "../../../../../entities";

export interface IErc20TokenDeployDto {
  contractFeatures: Array<Erc20ContractFeatures>;
  name: string;
  symbol: string;
  cap: string;
}
