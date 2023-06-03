import { FC, Fragment, useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import { Send } from "@mui/icons-material";
import { Web3ContextType } from "@web3-react/core";
import { Contract } from "ethers";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { useIntl } from "react-intl";

import VestingTransferOwnershipABI from "../../../../../abis/mechanics/vesting/transfer-ownership/transferOwnership.abi.json";

import { AccountDialog, IAccountDto } from "../../../../dialogs/account";

interface IVestingTransferOwnershipButtonProps {
  vesting: IContract;
}

export const VestingTransferOwnershipButton: FC<IVestingTransferOwnershipButtonProps> = props => {
  const { vesting } = props;

  const [isTransferOwnershipDialogOpen, setIsTransferOwnershipDialogOpen] = useState(false);

  const { formatMessage } = useIntl();

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
      <Tooltip title={formatMessage({ id: "form.tips.transfer" })}>
        <IconButton onClick={handleTransferOwnership} data-testid="VestingTransferOwnershipButton">
          <Send />
        </IconButton>
      </Tooltip>
      <AccountDialog
        onConfirm={handleTransferOwnershipConfirm}
        onCancel={handleTransferOwnershipCancel}
        open={isTransferOwnershipDialogOpen}
        message="dialogs.transfer"
        testId="VestingTransferOwnershipDialogForm"
        initialValues={{
          account: "",
        }}
      />
    </Fragment>
  );
};
