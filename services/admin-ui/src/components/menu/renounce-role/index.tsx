import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { NoAccounts } from "@mui/icons-material";

import { AccessControlRenounceRoleDialog } from "./edit";

export interface IContractRenounceRoleMenuItemProps {
  address: string;
}

export const ContractRenounceRoleMenuItem: FC<IContractRenounceRoleMenuItemProps> = props => {
  const { address } = props;

  const [isRenounceRoleDialogOpen, setIsRenounceRoleDialogOpen] = useState(false);

  const handleRenounceRole = (): void => {
    setIsRenounceRoleDialogOpen(true);
  };

  const handleRenounceRoleCancel = (): void => {
    setIsRenounceRoleDialogOpen(false);
  };

  const handleRenounceRoleConfirm = () => {
    setIsRenounceRoleDialogOpen(false);
  };

  return (
    <Fragment>
      <MenuItem onClick={handleRenounceRole}>
        <ListItemIcon>
          <NoAccounts fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.renounceRole" />
        </Typography>
      </MenuItem>
      <AccessControlRenounceRoleDialog
        onCancel={handleRenounceRoleCancel}
        onConfirm={handleRenounceRoleConfirm}
        open={isRenounceRoleDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
