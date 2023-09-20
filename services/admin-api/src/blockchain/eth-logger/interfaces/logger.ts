import { ListenerType } from "@framework/types";

export interface IEthLoggerInOutDto {
  address: string;
  listenerType: ListenerType;
  fromBlock?: number;
  chainId: number;
}
