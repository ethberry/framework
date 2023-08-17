import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { ManageHistory } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { BusinessType, CronExpression, IContract } from "@framework/types";

import { RaffleScheduleDialog } from "./dialog";
import { UpgradeProductTypeDialog } from "../../../../../dialogs/product-type";

export interface IRaffleScheduleFullMenuItemProps {
  contract: IContract;
  refreshPage: () => Promise<void>;
}

export const RaffleScheduleMenuItem: FC<IRaffleScheduleFullMenuItemProps> = props => {
  const {
    contract: { id, parameters },
    refreshPage,
  } = props;

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: `/raffle/contracts/${id}/schedule`,
      method: "POST",
      data: values,
    });
  });

  const handleSchedule = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleScheduleConfirm = async (values: Partial<any>, form: any) => {
    return fn(form, values).then(async () => {
      setIsScheduleDialogOpen(false);
      await refreshPage();
    });
  };

  const handleScheduleCancel = () => {
    setIsScheduleDialogOpen(false);
  };

  return (
    <Fragment>
      <MenuItem onClick={handleSchedule} data-testid="RaffleScheduleButton">
        <ListItemIcon>
          <ManageHistory fontSize="small" />
        </ListItemIcon>
        <Typography variant="inherit">
          <FormattedMessage id="form.buttons.schedule" />
        </Typography>
      </MenuItem>
      {process.env.BUSINESS_TYPE === BusinessType.B2B ? (
        <UpgradeProductTypeDialog open={isScheduleDialogOpen} onClose={handleScheduleCancel} />
      ) : (
        <RaffleScheduleDialog
          onConfirm={handleScheduleConfirm}
          onCancel={handleScheduleCancel}
          open={isScheduleDialogOpen}
          initialValues={{
            schedule: parameters.schedule as CronExpression,
          }}
        />
      )}
    </Fragment>
  );
};
