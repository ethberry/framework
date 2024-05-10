import { IContract } from "@framework/types";

export function haveChainlinkCompatibility(contract: IContract): boolean {
  const { parameters } = contract;
  return !!(parameters.vrfSubId || parameters.isConsumer);
}
