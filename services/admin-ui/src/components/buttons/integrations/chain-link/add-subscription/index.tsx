import { FC, Fragment, useState } from "react";
import { BigNumber, Contract, utils } from "ethers";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { Button, Typography } from "@mui/material";
import { RecentActors } from "@mui/icons-material";

import { FormattedMessage } from "react-intl";

import { useMetamask } from "@gemunion/react-hooks-eth";
import VrfAddConsumer from "../../../../../abis/integrations/chain-link/subscription/addConsumer.abi.json";

import { ChainLinkSubscriptionDialog, IChainLinkVrfSubscriptionDDto } from "./dialog";

export const ChainLinkSubscriptionButton: FC = () => {
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
      <Typography variant="body1">
        <FormattedMessage id="dialogs.addConsumer" />
      </Typography>
      <Button
        variant="outlined"
        startIcon={<RecentActors />}
        onClick={handleAddConsumer}
        data-testid="ChainLinkAddConsumerButton"
        disabled={!account}
      >
        <FormattedMessage id="form.buttons.addConsumer" />
      </Button>
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
