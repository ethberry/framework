import { FC, Fragment, useState } from "react";
import { Send } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import type { IContract } from "@framework/types";

import VestingTransferOwnershipABI from "../../../../../abis/mechanics/vesting/transfer-ownership/transferOwnership.abi.json";

import { AccountDialog, IAccountDto } from "../../../../dialogs/account";

interface IVestingTransferOwnershipButtonProps {
  className?: string;
  disabled?: boolean;
  variant?: ListActionVariant;
  vesting: IContract;
}

export const VestingTransferOwnershipButton: FC<IVestingTransferOwnershipButtonProps> = props => {
  const { className, disabled, variant, vesting } = props;

  const [isTransferOwnershipDialogOpen, setIsTransferOwnershipDialogOpen] = useState(false);

  const metaFn = useMetamask((dto: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(vesting.address, VestingTransferOwnershipABI, web3Context.provider?.getSigner());
    return contract.transferOwnership(dto.account) as Promise<any>;
  });

  const handleTransferOwnership = (): void => {
    setIsTransferOwnershipDialogOpen(true);
  };

  const handleTransferOwnershipConfirm = async (dto: IAccountDto) => {
    await metaFn(dto).finally(() => {
      setIsTransferOwnershipDialogOpen(false);
    });
  };

  const handleTransferOwnershipCancel = () => {
    setIsTransferOwnershipDialogOpen(false);
  };

  return (
    <Fragment>
      <ListAction
        onClick={handleTransferOwnership}
        icon={Send}
        message="form.tips.transferOwnership"
        className={className}
        dataTestId="VestingTransferOwnershipButton"
        disabled={disabled}
        variant={variant}
      />
      <AccountDialog
        onConfirm={handleTransferOwnershipConfirm}
        onCancel={handleTransferOwnershipCancel}
        open={isTransferOwnershipDialogOpen}
        message="dialogs.transferOwnership"
        testId="VestingTransferOwnershipDialogForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
