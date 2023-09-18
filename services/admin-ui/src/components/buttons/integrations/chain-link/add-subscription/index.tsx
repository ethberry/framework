import { FC, Fragment, useState } from "react";
import { RecentActors } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { useMetamask } from "@gemunion/react-hooks-eth";

import VrfAddConsumer from "../../../../../abis/integrations/chain-link/subscription/addConsumer.abi.json";

import { ChainLinkSubscriptionDialog, IChainLinkVrfSubscriptionDDto } from "./dialog";

export interface IChainLinkSubscriptionButtonProps {
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ChainLinkSubscriptionButton: FC<IChainLinkSubscriptionButtonProps> = props => {
  const { disabled, variant = ListActionVariant.button } = props;

  const { account } = useWeb3React();
  const [isSubscriptionDialogOpen, setIsSubscriptionDialogOpen] = useState(false);

  const metaFnAddConsumer = useMetamask(async (values: IChainLinkVrfSubscriptionDDto, web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    const contract = new Contract(process.env.VRF_ADDR, VrfAddConsumer, web3Context.provider?.getSigner());
    const subId = utils.hexZeroPad(utils.hexlify(BigNumber.from(values.subscriptionId)), 32);
    return contract.addConsumer(subId, values.address) as Promise<void>;
  });

  const handleAddConsumer = (): void => {
    setIsSubscriptionDialogOpen(true);
  };

  const handleAddConsumerConfirm = async (values: IChainLinkVrfSubscriptionDDto): Promise<void> => {
    await metaFnAddConsumer(values).finally(() => {
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
        dataTestId="ChainLinkAddConsumerButton"
        disabled={disabled || !account}
        variant={variant}
      />
      <ChainLinkSubscriptionDialog
        onCancel={handleAddConsumerCancel}
        onConfirm={handleAddConsumerConfirm}
        open={isSubscriptionDialogOpen}
        initialValues={{
          subscriptionId: "1",
          address: "0x",
        }}
      />
    </Fragment>
  );
};
