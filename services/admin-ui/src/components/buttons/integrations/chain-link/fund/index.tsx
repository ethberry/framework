import { FC, Fragment, useState } from "react";
import { Savings } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { BigNumber, Contract, utils } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import { SystemModuleType } from "@framework/types";
import type { IContract } from "@framework/types";
import { useMetamask, useSystemContract } from "@ethberry/react-hooks-eth";

import { ChainLinkFundDialog, IChainLinkFundDto } from "./dialog";
import ERC677TransferAndCallABI from "@framework/abis/json/ERC677/transferAndCall.json";

export interface IChainLinkFundButtonProps {
  subscriptionId: string;
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const ChainLinkFundButton: FC<IChainLinkFundButtonProps> = props => {
  const { subscriptionId, className, disabled, variant = ListActionVariant.button } = props;

  const { account } = useWeb3React();
  const [isFundDialogOpen, setIsFundDialogOpen] = useState(false);

  const handleFund = (): void => {
    setIsFundDialogOpen(true);
  };

  const metaTransfer = useSystemContract<IContract, SystemModuleType>(
    async (values: IChainLinkFundDto, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(
        systemContract.parameters.linkAddress.toString(),
        ERC677TransferAndCallABI,
        web3Context.provider?.getSigner(),
      );
      const subId = utils.hexZeroPad(utils.hexlify(BigNumber.from(values.subscriptionId)), 32);
      return contract.transferAndCall(systemContract.address, values.amount, subId) as Promise<void>;
    },
  );

  const metaFnTransfer = useMetamask((values: IChainLinkFundDto, web3Context: Web3ContextType) => {
    return metaTransfer(SystemModuleType.CHAIN_LINK, values, web3Context);
  });

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
          amount: 0n,
          subscriptionId,
        }}
      />
    </Fragment>
  );
};
