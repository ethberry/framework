import { ChainLinkSupportedChains, Erc998ContractTemplates, NodeEnv } from "@framework/types";

export const isTemplateDisabled = (chainId: number) => {
  const disabledTemplates = [];

  // These templates have too long code
  disabledTemplates.push(
    Erc998ContractTemplates.ERC1155OWNER_ERC20OWNER,
    Erc998ContractTemplates.ERC20OWNER,
    Erc998ContractTemplates.ERC1155OWNER,
  );

  if (process.env.NODE_ENV !== NodeEnv.development) {
    // Rent (is not tested yet)
    disabledTemplates.push(Erc998ContractTemplates.RENTABLE);

    // ChainLink
    if (!ChainLinkSupportedChains[chainId]) {
      disabledTemplates.push(
        Erc998ContractTemplates.RANDOM,
        Erc998ContractTemplates.DISCRETE_RANDOM,
        Erc998ContractTemplates.BLACKLIST_DISCRETE_RANDOM,
        Erc998ContractTemplates.BLACKLIST_RANDOM,
      );
    }
  }

  return disabledTemplates;
};
