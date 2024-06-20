import { ChainLinkV2SupportedChains, Erc721ContractTemplates, NodeEnv } from "@framework/types";

export const isTemplateDisabled = (chainId: number) => {
  const disabledTemplates = [];

  // Deployed through corresponding mechanics
  disabledTemplates.push(Erc721ContractTemplates.RAFFLE, Erc721ContractTemplates.LOTTERY);

  if (process.env.NODE_ENV === NodeEnv.production) {
    // Rent (is not tested yet)
    disabledTemplates.push(
      Erc721ContractTemplates.RENTABLE,
      Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE,
      Erc721ContractTemplates.BLACKLIST_DISCRETE_RENTABLE_RANDOM,
    );

    // Genes
    disabledTemplates.push(Erc721ContractTemplates.GENES);

    // ChainLink
    if (!ChainLinkV2SupportedChains[chainId]) {
      disabledTemplates.push(
        Erc721ContractTemplates.RANDOM,
        Erc721ContractTemplates.DISCRETE_RANDOM,
        Erc721ContractTemplates.BLACKLIST_DISCRETE_RANDOM,
        Erc721ContractTemplates.BLACKLIST_RANDOM,
      );
    }
  }

  return disabledTemplates;
};
