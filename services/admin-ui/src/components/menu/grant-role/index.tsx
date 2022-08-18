import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { AccessControlRoleHash, AccessControlRoleType } from "@framework/types";

import IAccessControlSol from "@framework/core-contracts/artifacts/@openzeppelin/contracts/access/IAccessControl.sol/IAccessControl.json";

import { AccessControlGrantRoleDialog, IGrantRoleDto } from "./edit";

export interface IOzContractGrantRoleMenuItemProps {
  address: string;
}

export const ContractGrantRoleMenuItem: FC<IOzContractGrantRoleMenuItemProps> = props => {
  const { address } = props;

  const [isGrantRoleDialogOpen, setIsGrantRoleDialogOpen] = useState(false);

  const handleGrantRole = (): void => {
    setIsGrantRoleDialogOpen(true);
  };

  const handleGrantRoleCancel = (): void => {
    setIsGrantRoleDialogOpen(false);
  };

  const meta = useMetamask((values: IGrantRoleDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, IAccessControlSol.abi, web3Context.provider?.getSigner());
    return contract.grantRole(AccessControlRoleHash[values.role], values.address) as Promise<void>;
  });

  const handleGrantRoleConfirmed = async (values: IGrantRoleDto): Promise<void> => {
    await meta(values).finally(() => {
      setIsGrantRoleDialogOpen(false);
    });
  };

  return (
    <Fragment>
      <MenuItem onClick={handleGrantRole}>
        <ListItemIcon>
          <AccountCircle fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.grantRole" />
        </Typography>
      </MenuItem>
      <AccessControlGrantRoleDialog
        onCancel={handleGrantRoleCancel}
        onConfirm={handleGrantRoleConfirmed}
        open={isGrantRoleDialogOpen}
        initialValues={{
          role: AccessControlRoleType.DEFAULT_ADMIN_ROLE,
          address: "",
        }}
      />
    </Fragment>
  );
};
