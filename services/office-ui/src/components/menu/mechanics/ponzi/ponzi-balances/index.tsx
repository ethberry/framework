import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { MonetizationOn } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { PonziBalanceDialog } from "./view";

export interface IPonziBalanceMenuItemProps {
  contract: IContract;
}

export const PonziBalanceMenuItem: FC<IPonziBalanceMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isPonziBalanceDialogOpen, setIsPonziBalanceDialogOpen] = useState(false);

  const handlePonziBalance = (): void => {
    setIsPonziBalanceDialogOpen(true);
  };

  const handlePonziBalanceCancel = (): void => {
    setIsPonziBalanceDialogOpen(false);
  };

  const handlePonziBalanceConfirm = () => {
    setIsPonziBalanceDialogOpen(false);
  };

  return (
    <Fragment>
      <MenuItem onClick={handlePonziBalance}>
        <ListItemIcon>
          <MonetizationOn fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.ponziBalance" />
        </Typography>
      </MenuItem>
      <PonziBalanceDialog
        onCancel={handlePonziBalanceCancel}
        onConfirm={handlePonziBalanceConfirm}
        open={isPonziBalanceDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
