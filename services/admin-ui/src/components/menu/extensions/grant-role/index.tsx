import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import { Contract } from "ethers";
import { Web3ContextType } from "@web3-react/core";

import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IContract } from "@framework/types";
import { AccessControlRoleHash, AccessControlRoleType, ContractSecurity } from "@framework/types";

import GrantRoleABI from "../../../../abis/extensions/grant-role/grantRole.abi.json";

import { AccessControlGrantRoleDialog, IGrantRoleDto } from "./dialog";

export interface IGrantRoleMenuItemProps {
  contract: IContract;
}

export const GrantRoleMenuItem: FC<IGrantRoleMenuItemProps> = props => {
  const {
    contract: { address, contractSecurity },
  } = props;

  const [isGrantRoleDialogOpen, setIsGrantRoleDialogOpen] = useState(false);

  const handleGrantRole = (): void => {
    setIsGrantRoleDialogOpen(true);
  };

  const handleGrantRoleCancel = (): void => {
    setIsGrantRoleDialogOpen(false);
  };

  const metaFn = useMetamask((values: IGrantRoleDto, web3Context: Web3ContextType) => {
    const contract = new Contract(address, GrantRoleABI, web3Context.provider?.getSigner());
    return contract.grantRole(AccessControlRoleHash[values.role], values.address) as Promise<void>;
  });

  const handleGrantRoleConfirmed = async (values: IGrantRoleDto): Promise<void> => {
    await metaFn(values).finally(() => {
      setIsGrantRoleDialogOpen(false);
    });
  };

  if (contractSecurity !== ContractSecurity.ACCESS_CONTROL) {
    return null;
  }

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
