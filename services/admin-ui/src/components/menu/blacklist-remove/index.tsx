import { FC, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { DoNotDisturbOff } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { AccessListUnBlacklistDialog } from "./edit";

export interface IUnBlacklistMenuItemProps {
  address: string;
}

export const UnBlacklistMenuItem: FC<IUnBlacklistMenuItemProps> = props => {
  const { address } = props;

  const [isUnBlacklistDialogOpen, setIsUnBlacklistDialogOpen] = useState(false);

  const handleUnBlacklist = (): void => {
    setIsUnBlacklistDialogOpen(true);
  };

  const handleUnBlacklistCancel = (): void => {
    setIsUnBlacklistDialogOpen(false);
  };

  const handleUnBlacklistConfirm = () => {
    setIsUnBlacklistDialogOpen(false);
  };

  return (
    <>
      <MenuItem onClick={handleUnBlacklist}>
        <ListItemIcon>
          <DoNotDisturbOff fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.unblacklist" />
        </Typography>
      </MenuItem>
      <AccessListUnBlacklistDialog
        onCancel={handleUnBlacklistCancel}
        onConfirm={handleUnBlacklistConfirm}
        open={isUnBlacklistDialogOpen}
        data={{ address }}
      />
    </>
  );
};
