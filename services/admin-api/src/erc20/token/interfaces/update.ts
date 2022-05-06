import { Erc20TokenStatus } from "@framework/types";

export interface IErc20TokenUpdateDto {
  description: string;
  tokenStatus: Erc20TokenStatus;
}
