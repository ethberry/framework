import { FC, Fragment } from "react";
import { RecentActors } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { useMetamask } from "@gemunion/react-hooks-eth";

import VrfCreateSub from "../../../../../abis/integrations/chain-link/subscription/createSub.abi.json";

export interface IChainLinkSubscriptionCreateButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ChainLinkSubscriptionCreateButton: FC<IChainLinkSubscriptionCreateButtonProps> = props => {
  const { className, disabled, variant = ListActionVariant.button } = props;

  const { account } = useWeb3React();

  const metaFnCreateSub = useMetamask((web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    // TODO get VRF contract address from backend
    const contract = new Contract(process.env.VRF_ADDR, VrfCreateSub, web3Context.provider?.getSigner());
    return contract.createSubscription() as Promise<void>;
  });

  const handleCreateSub = () => {
    return metaFnCreateSub();
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
