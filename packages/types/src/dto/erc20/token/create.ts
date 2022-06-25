import { Erc20TokenTemplate } from "../../../entities";

export interface IErc20TokenCreateDto {
  contractTemplate: Erc20TokenTemplate;
  symbol: string;
  decimals: number;
  title: string;
  description: string;
  address: string;
}
