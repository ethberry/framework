import { ChainLinkV2SupportedChains, Erc998ContractTemplates, NodeEnv } from "@framework/types";
import { Networks } from "@gemunion/types-blockchain";

export const isTemplateDisabled = (chainId: number) => {
  const disabledTemplates = [];

  // These templates have too long code so can be deployed only on private network
  if (!(chainId === Number(Networks.GEMUNION) || chainId === Number(Networks.GEMUNION_BESU))) {
    disabledTemplates.push(
      Erc998ContractTemplates.ERC20OWNER,
      Erc998ContractTemplates.ERC1155OWNER,
      Erc998ContractTemplates.ERC1155OWNER_ERC20OWNER,
    );
  }

  if (process.env.NODE_ENV === NodeEnv.production) {
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
