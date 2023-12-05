import { FC, Fragment, useState } from "react";
import { ChangeCircle } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/styled";
import type { IContract } from "@framework/types";
import { ContractSecurity } from "@framework/types";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";
import { transferOwnershipOwnershipFacetABI } from "@framework/abis";

export interface ITransferOwnershipButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  variant?: ListActionVariant;
}

export const TransferOwnershipButton: FC<ITransferOwnershipButtonProps> = props => {
  const {
    className,
    contract: { address, contractSecurity },
    disabled,
    variant,
  } = props;

  const [isOwnershipDialogOpen, setIsOwnershipDialogOpen] = useState(false);

  const metaFn = useMetamask((values: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, transferOwnershipOwnershipFacetABI, web3Context.provider?.getSigner());
    return contract.transferOwnership(values.account) as Promise<any>;
  });

  const handleTransferOwnership = () => {
    setIsOwnershipDialogOpen(true);
  };

  const handleTransferOwnershipConfirm = async (values: IAccountDto) => {
    await metaFn(values);
    setIsOwnershipDialogOpen(false);
  };

  const handleTransferOwnershipCancel = () => {
    setIsOwnershipDialogOpen(false);
  };

  if (contractSecurity !== ContractSecurity.OWNABLE) {
    return null;
  }

  return (
    <Fragment>
      <ListAction
        onClick={handleTransferOwnership}
        icon={ChangeCircle}
        message="form.buttons.transferOwnership"
        className={className}
        dataTestId="TransferOwnershipButton"
        disabled={disabled}
        variant={variant}
      />
      <AccountDialog
        onCancel={handleTransferOwnershipCancel}
        onConfirm={handleTransferOwnershipConfirm}
        open={isOwnershipDialogOpen}
        message="dialogs.transferOwnership"
        testId="TransferOwnershipForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
