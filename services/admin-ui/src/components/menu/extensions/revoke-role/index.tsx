import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { NoAccounts } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { AccessControlRevokeRoleDialog } from "./dialog";
import { ContractSecurity } from "@framework/types";

export interface IRevokeRoleMenuItemProps {
  contract: IContract;
}

export const RevokeRoleMenuItem: FC<IRevokeRoleMenuItemProps> = props => {
  const {
    contract: { address, contractSecurity },
  } = props;

  const [isRevokeRoleDialogOpen, setIsRevokeRoleDialogOpen] = useState(false);

  const handleRevokeRole = (): void => {
    setIsRevokeRoleDialogOpen(true);
  };

  const handleRevokeRoleCancel = (): void => {
    setIsRevokeRoleDialogOpen(false);
  };

  const handleRevokeRoleConfirm = () => {
    setIsRevokeRoleDialogOpen(false);
  };

  if (contractSecurity !== ContractSecurity.ACCESS_CONTROL) {
    return null;
  }

  return (
    <Fragment>
      <MenuItem onClick={handleRevokeRole}>
        <ListItemIcon>
          <NoAccounts fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.revokeRole" />
        </Typography>
      </MenuItem>
      <AccessControlRevokeRoleDialog
        onCancel={handleRevokeRoleCancel}
        onConfirm={handleRevokeRoleConfirm}
        open={isRevokeRoleDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
