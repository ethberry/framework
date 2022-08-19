import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { DoNotDisturbOff } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { IContract } from "@framework/types";

import { AccessListUnBlacklistDialog } from "./edit";

export interface IUnBlacklistMenuItemProps {
  contract: IContract;
}

export const UnBlacklistMenuItem: FC<IUnBlacklistMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

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
    <Fragment>
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
    </Fragment>
  );
};
