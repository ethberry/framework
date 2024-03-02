import { FC, Fragment, useState } from "react";
import { HowToVote } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask, useSystemContract } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import { ContractFeatures, IContract, IToken, SystemModuleType } from "@framework/types";

import SetApprovalForAllABI from "@framework/abis/setApprovalForAll/ERC1155Blacklist.json";

import { AllowanceForAllDialog } from "./dialog";

export interface IAllowanceForAllButtonProps {
  className?: string;
  disabled?: boolean;
  token: IToken;
  variant?: ListActionVariant;
}

export const AllowanceForAllButton: FC<IAllowanceForAllButtonProps> = props => {
  const { className, disabled, token, variant } = props;

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
        token.template!.contract!.address,
        SetApprovalForAllABI,
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

  const isDisabled =
    token.template && token.template.contract
      ? token.template.contract.contractFeatures.includes(ContractFeatures.ALLOWANCE)
      : true;

  return (
    <Fragment>
      <ListAction
        onClick={handleAllowance}
        icon={HowToVote}
        message="form.tips.allowanceForAll"
        className={className}
        dataTestId="AllowanceForAllButton"
        disabled={isDisabled || disabled}
        variant={variant}
      />
      <AllowanceForAllDialog
        onCancel={handleAllowanceCancel}
        onConfirm={handleAllowanceConfirm}
        open={isAllowanceDialogOpen}
        // initialValues={{}}
      />
    </Fragment>
  );
};
