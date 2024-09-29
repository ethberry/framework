import { FC, Fragment, useState } from "react";
import { HowToVote } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { SystemModuleType } from "@framework/types";
import { useMetamask, useSystemContract } from "@ethberry/react-hooks-eth";
import { InputType } from "@ethberry/types-collection";

import ERC1155SimpleSetApprovalForAllABI from "@framework/abis/json/ERC1155Simple/setApprovalForAll.json";

import { AllowanceForAllDialog } from "./dialog";

export interface IAllowanceForAllButtonProps {
  className?: string;
  disabled?: boolean;
  contract: IContract;
  variant?: ListActionVariant;
}

export const AllowanceForAllButton: FC<IAllowanceForAllButtonProps> = props => {
  const { className, disabled, contract, variant } = props;

  const [isAllowanceDialogOpen, setIsAllowanceDialogOpen] = useState(false);

  const handleAllowance = (): void => {
    setIsAllowanceDialogOpen(true);
  };

  const handleAllowanceCancel = (): void => {
    setIsAllowanceDialogOpen(false);
  };

  const metaFnWithContract = useSystemContract<IContract, SystemModuleType>(
    (_values: null, web3Context: Web3ContextType, systemContract: IContract) => {
      const tokenContract = new Contract(
        contract.address,
        ERC1155SimpleSetApprovalForAllABI,
        web3Context.provider?.getSigner(),
      );

      return tokenContract.setApprovalForAll(systemContract.address, true) as Promise<void>;
    },
  );

  const metaFn = useMetamask((web3Context: Web3ContextType) => {
    return metaFnWithContract(SystemModuleType.EXCHANGE, null, web3Context);
  });

  const handleAllowanceConfirm = async (): Promise<void> => {
    await metaFn().finally(() => {
      setIsAllowanceDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleAllowance}
        icon={HowToVote}
        message="form.tips.allowanceForAll"
        className={className}
        dataTestId="AllowanceForAllButton"
        disabled={disabled}
        variant={variant}
      />
      <AllowanceForAllDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        initialValues={{
          contractId: InputType.awaited,
          contract: { address: "" },
        }}
      />
    </Fragment>
  );
};
