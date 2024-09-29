import { ChainLinkV2SupportedChains, Erc998ContractTemplates } from "@framework/types";
import { NodeEnv } from "@ethberry/constants";

export const isTemplateDisabled = (chainId: number) => {
  const disabledTemplates = [];

  if (process.env.NODE_ENV === NodeEnv.production) {
    // These templates have too long code
    disabledTemplates.push(
      Erc998ContractTemplates.ERC1155OWNER_ERC20OWNER,
      Erc998ContractTemplates.ERC20OWNER,
      Erc998ContractTemplates.ERC1155OWNER,
    );

    // Rent (is not tested yet)
    disabledTemplates.push(Erc998ContractTemplates.RENTABLE);

    // ChainLink
    if (!ChainLinkV2SupportedChains[chainId]) {
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
