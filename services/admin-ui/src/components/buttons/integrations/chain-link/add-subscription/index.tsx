import { FC, Fragment, useState } from "react";

import { RecentActors } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { useMetamask, useSystemContract } from "@gemunion/react-hooks-eth";

import VrfAddConsumer from "../../../../../abis/integrations/chain-link/subscription/addConsumer.abi.json";

import { ChainLinkSubscriptionDialog, IChainLinkVrfSubscriptionDto } from "./dialog";
import type { IContract } from "@framework/types";
import { SystemModuleType } from "@framework/types";

export interface IChainLinkAddConsumerButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
  subscriptionId: number;
  contractId?: number;
}

export const ChainLinkAddConsumerButton: FC<IChainLinkAddConsumerButtonProps> = props => {
  const { contractId, subscriptionId, className, disabled, variant = ListActionVariant.button } = props;

  const { account } = useWeb3React();
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);

  const metaAddConsumer = useSystemContract<IContract, SystemModuleType>(
    async (values: IChainLinkVrfSubscriptionDto, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(systemContract.address, VrfAddConsumer, web3Context.provider?.getSigner());
      const subId = utils.hexZeroPad(utils.hexlify(BigNumber.from(values.vrfSubId)), 32);
      return contract.addConsumer(subId, values.address) as Promise<void>;
    },
  );

  const metaFnAddConsumer = useMetamask((values: IChainLinkVrfSubscriptionDto, web3Context: Web3ContextType) => {
    return metaAddConsumer(SystemModuleType.CHAIN_LINK, values, web3Context);
  });

  const handleAddConsumer = (): void => {
    setIsSubscriptionDialogOpen(true);
  };

  const handleAddConsumerConfirm = async (values: IChainLinkVrfSubscriptionDto): Promise<void> => {
    await metaFnAddConsumer(values).then(() => {
      setIsSubscriptionDialogOpen(false);
    });
  };

  const handleAddConsumerCancel = () => {
    setIsSubscriptionDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleAddConsumer}
        icon={RecentActors}
        message="form.buttons.addConsumer"
        className={className}
        dataTestId="ChainLinkAddConsumerButton"
        disabled={disabled || !account}
        variant={variant}
      />
      <ChainLinkSubscriptionDialog
        onCancel={handleAddConsumerCancel}
        onConfirm={handleAddConsumerConfirm}
        open={isSubscriptionDialogOpen}
        initialValues={{
          vrfSubId: subscriptionId,
          address: "0x",
          contractId,
        }}
      />
    </Fragment>
  );
};
