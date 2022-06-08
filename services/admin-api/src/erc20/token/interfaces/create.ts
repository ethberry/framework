import { Erc20TokenTemplate } from "@framework/types";

export interface IErc20TokenCreateDto {
  contractTemplate: Erc20TokenTemplate;
  symbol: string;
  title: string;
  description: string;
  address: string;
}
