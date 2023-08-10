import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { ChangeCircle } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { ContractSecurity } from "@framework/types";

import TransferOwnershipABI from "../../../../abis/extensions/transfer-ownership/transferOwnership.abi.json";

import { AccountDialog, IAccountDto } from "../../../dialogs/account";

export interface ITransferOwnershipMenuItemProps {
  contract: IContract;
}

export const TransferOwnershipMenuItem: FC<ITransferOwnershipMenuItemProps> = props => {
  const {
    contract: { address, contractSecurity },
  } = props;

  const [isOwnershipDialogOpen, setIsOwnershipDialogOpen] = useState(false);

  const metaFn = useMetamask((values: IAccountDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, TransferOwnershipABI, web3Context.provider?.getSigner());
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
      <MenuItem onClick={handleTransferOwnership}>
        <ListItemIcon>
          <ChangeCircle />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.transferOwnership" />
        </Typography>
      </MenuItem>
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
