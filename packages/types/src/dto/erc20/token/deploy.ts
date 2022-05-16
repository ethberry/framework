import { Erc20TokenTemplate } from "../../../entities";

export interface IErc20TokenDeployDto {
  contractTemplate: Erc20TokenTemplate;
  name: string;
  symbol: string;
  cap: string;
}
