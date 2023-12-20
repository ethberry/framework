import { ContractEventSignature } from "@framework/types";

export const EventRouteMatch: Partial<Record<keyof typeof ContractEventSignature, string>> = {
  ERC1155TokenDeployed: "/erc1155/contracts",
};
