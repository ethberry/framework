import { IContract } from "@framework/types";

export function haveChainlinkCompatibility(contract: IContract): boolean {
  const { parameters } = contract;

  if (contract.chainId === 10000 || contract.chainId === 10001) {
    return !!(parameters.vrfSubId && parameters.isConsumer);
  }
  // Temporarly set as true to test chainlink v2.5
  return true;
}
