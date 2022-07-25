import { Erc20ContractTemplate } from "../../../entities";

export interface IErc20TokenCreateDto {
  contractTemplate: Erc20ContractTemplate;
  symbol: string;
  decimals: number;
  title: string;
  description: string;
  address: string;
}
