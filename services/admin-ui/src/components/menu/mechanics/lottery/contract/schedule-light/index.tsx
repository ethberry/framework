import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { ManageHistory } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { IContract } from "@framework/types";

import { UpgradeProductTypeDialog } from "../../../../../dialogs/product-type";

export interface ILotteryScheduleMenuItemProps {
  contract: IContract;
}

export const LotteryScheduleLightMenuItem: FC<ILotteryScheduleMenuItemProps> = () => {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const handleSchedule = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleScheduleCancel = () => {
    setIsScheduleDialogOpen(false);
  };

  return (
    <Fragment>
      <MenuItem onClick={handleSchedule} data-testid="LotteryScheduleButton">
        <ListItemIcon>
          <ManageHistory fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.schedule" />
        </Typography>
      </MenuItem>
      <UpgradeProductTypeDialog onClose={handleScheduleCancel} open={isScheduleDialogOpen} />
    </Fragment>
  );
};
