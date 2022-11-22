import { FC, Fragment, useState } from "react";
import { FormattedMessage } from "react-intl";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { MonetizationOn } from "@mui/icons-material";

import type { IContract } from "@framework/types";

import { PyramidBalanceDialog } from "./dialog";

export interface IPyramidBalanceMenuItemProps {
  contract: IContract;
}

export const PyramidBalanceMenuItem: FC<IPyramidBalanceMenuItemProps> = props => {
  const {
    contract: { address },
  } = props;

  const [isPyramidBalanceDialogOpen, setIsPyramidBalanceDialogOpen] = useState(false);

  const handlePyramidBalance = (): void => {
    setIsPyramidBalanceDialogOpen(true);
  };

  const handlePyramidBalanceCancel = (): void => {
    setIsPyramidBalanceDialogOpen(false);
  };

  const handlePyramidBalanceConfirm = () => {
    setIsPyramidBalanceDialogOpen(false);
  };

  return (
    <Fragment>
      <MenuItem onClick={handlePyramidBalance}>
        <ListItemIcon>
          <MonetizationOn fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.pyramidBalance" />
        </Typography>
      </MenuItem>
      <PyramidBalanceDialog
        onCancel={handlePyramidBalanceCancel}
        onConfirm={handlePyramidBalanceConfirm}
        open={isPyramidBalanceDialogOpen}
        data={{ address }}
      />
    </Fragment>
  );
};
