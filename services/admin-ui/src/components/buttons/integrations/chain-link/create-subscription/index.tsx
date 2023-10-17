import { FC, Fragment } from "react";
import { RecentActors } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { useMetamask, useSystemContract } from "@gemunion/react-hooks-eth";

import VrfCreateSub from "../../../../../abis/integrations/chain-link/subscription/createSub.abi.json";
import type { IContract } from "@framework/types";
import { SystemModuleType } from "@framework/types";

export interface IChainLinkSubscriptionCreateButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ChainLinkSubscriptionCreateButton: FC<IChainLinkSubscriptionCreateButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { account } = useWeb3React();

  const metaFnCreateSub = useSystemContract<IContract, SystemModuleType>(
    (values: any, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      // TODO get VRF contract address from backend
      const contract = new Contract(systemContract.address, VrfCreateSub, web3Context.provider?.getSigner());
      return contract.createSubscription() as Promise<void>;
    },
  );

  const metaFnCreateSubscription = useMetamask((web3Context: Web3ContextType) => {
    return metaFnCreateSub(SystemModuleType.CHAIN_LINK, null, web3Context);
  });

  const handleCreateSub = () => {
    return metaFnCreateSubscription();
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleCreateSub}
        icon={RecentActors}
        message="pages.chain-link.create"
        className={className}
        dataTestId="ChainLinkCreateSubscriptionButton"
        disabled={disabled || !account}
        variant={variant}
      />
    </Fragment>
  );
};
