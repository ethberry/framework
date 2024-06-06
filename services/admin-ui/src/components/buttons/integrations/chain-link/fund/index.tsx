/* eslint-disable @typescript-eslint/no-unsafe-return */
import { FC, Fragment, useState, useEffect } from "react";
import { Savings } from "@mui/icons-material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { BigNumber, BigNumberish, Contract, utils } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import { SystemModuleType } from "@framework/types";
import type { IContract } from "@framework/types";
import { useMetamask, useMetamaskValue, useSystemContract } from "@gemunion/react-hooks-eth";

import { ChainLinkFundDialog, IChainLinkFundDto } from "./dialog";
import topUpCoordinatorABI from "@framework/abis/topUp/CoordinatorV2.json";
import ERC20AllowanceABI from "@framework/abis/allowance/ERC20Allowance.json";
import ERC20ApproveABI from "@framework/abis/approve/ERC20.json";
// import transferAndCallERC677ABI from "@framework/abis/transferAndCall/ERC677.json";

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

  const handleFund = (): void => {
    setIsFundDialogOpen(true);
  };

  const haveAllowanceForTx = (_allowance: BigNumberish, _amount: BigNumberish): boolean | null => {
    _allowance = BigNumber.from(_allowance);

    if (_allowance.lt(_amount)) {
      return false; // approve tokens
    } else {
      return true; // tranfer tokens
    }
  };

  const getAllowance = useSystemContract<IContract, SystemModuleType>(
    async (values: number, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(
        systemContract.parameters.linkAddress.toString(),
        ERC20AllowanceABI,
        web3Context.provider?.getSigner(),
      );
      return contract.callStatic.allowance(web3Context.account, systemContract.address);
    },
    { success: false },
  );

  const getAllowanceMetaFn = useMetamaskValue(async (web3Context: Web3ContextType) => {
    return getAllowance(SystemModuleType.CHAIN_LINK, null, web3Context);
  });

  const metaApprove = useSystemContract<IContract, SystemModuleType>(
    async (values: IChainLinkFundDto, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(
        systemContract.parameters.linkAddress.toString(),
        ERC20ApproveABI,
        web3Context.provider?.getSigner(),
      );
      return contract.approve(systemContract.address, values.amount) as Promise<void>;
    },
  );

  const metaFnApprove = useMetamask((values: IChainLinkFundDto, web3Context: Web3ContextType) => {
    return metaApprove(SystemModuleType.CHAIN_LINK, values, web3Context);
  });

  const metaTransfer = useSystemContract<IContract, SystemModuleType>(
    async (values: IChainLinkFundDto, web3Context: Web3ContextType, systemContract: IContract) => {
      // https://docs.chain.link/docs/link-token-contracts/
      const contract = new Contract(
        systemContract.address,
        // transferAndCallERC677ABI,
        topUpCoordinatorABI,
        web3Context.provider?.getSigner(),
      );
      // const subId = utils.hexZeroPad(utils.hexlify(BigNumber.from(values.subscriptionId)), 32);
      // return contract.transferAndCall(systemContract.address, values.amount, subId) as Promise<void>;
      return contract.topUp(values.subscriptionId, values.amount) as Promise<void>;
    },
  );

  const metaFnTransfer = useMetamask((values: IChainLinkFundDto, web3Context: Web3ContextType) => {
    return metaTransfer(SystemModuleType.CHAIN_LINK, values, web3Context);
  });

  const handleFundRoute = async (values: IChainLinkFundDto): Promise<void> => {
    const _allowance = await getAllowanceMetaFn();
    const haveAllowance = haveAllowanceForTx(_allowance, values.amount);

    if (haveAllowance === false) {
      // Not enough allowance, approve tokens
      return metaFnApprove(values);
    } else {
      // Make Transfer
      return metaFnTransfer(values);
    }
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
        onConfirm={handleFundRoute}
        open={isFundDialogOpen}
        initialValues={{
          amount: "0",
          subscriptionId,
        }}
      />
    </Fragment>
  );
};
