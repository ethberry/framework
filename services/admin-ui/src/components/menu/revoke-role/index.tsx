import { FC, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { NoAccounts } from "@mui/icons-material";

import { AccessControlRevokeRoleDialog } from "./edit";

export interface IContractRevokeRoleMenuItemProps {
  address: string;
}

export const OzContractRevokeRoleMenuItem: FC<IContractRevokeRoleMenuItemProps> = props => {
  const { address } = props;

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

  return (
    <>
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
    </>
  );
};
