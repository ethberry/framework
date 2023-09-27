import { FC, Fragment, useState } from "react";
import { Savings } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { useMetamask } from "@gemunion/react-hooks-eth";

import LinkTransferAndCallABI from "../../../../../abis/integrations/chain-link/fund/transferAndCall.abi.json";

import { ChainLinkFundDialog, IChainLinkFundDto } from "./dialog";

export interface IChainLinkFundButtonProps {
  subscriptionId: number;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ChainLinkFundButton: FC<IChainLinkFundButtonProps> = props => {
  const { subscriptionId, className, disabled, variant = ListActionVariant.button } = props;

  const { account } = useWeb3React();
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);

  const metaFnTransfer = useMetamask(async (values: IChainLinkFundDto, web3Context: Web3ContextType) => {
    // https://docs.chain.link/docs/link-token-contracts/
    const contract = new Contract(process.env.LINK_ADDR, LinkTransferAndCallABI, web3Context.provider?.getSigner());
    const subId = utils.hexZeroPad(utils.hexlify(BigNumber.from(values.subscriptionId)), 32);
    return contract.transferAndCall(process.env.VRF_ADDR, values.amount, subId) as Promise<void>;
  });

  const handleFund = (): void => {
    setIsFundDialogOpen(true);
  };

  const handleFundConfirm = async (values: IChainLinkFundDto): Promise<void> => {
    await metaFnTransfer(values).finally(() => {
      setIsFundDialogOpen(false);
    });
  };

  const handleFundCancel = () => {
    setIsFundDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleFund}
        icon={Savings}
        message="form.buttons.fund"
        className={className}
        dataTestId="ChainLinkFundButton"
        disabled={disabled || !account}
        variant={variant}
      />
      <ChainLinkFundDialog
        onCancel={handleFundCancel}
        onConfirm={handleFundConfirm}
        open={isFundDialogOpen}
        initialValues={{
          amount: "0",
          subscriptionId,
        }}
      />
    </Fragment>
  );
};
