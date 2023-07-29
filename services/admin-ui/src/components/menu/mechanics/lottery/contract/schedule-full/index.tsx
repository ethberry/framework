import { FC, Fragment, useState } from "react";
import { ListItemIcon, MenuItem, Typography } from "@mui/material";
import { ManageHistory } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useApiCall } from "@gemunion/react-hooks";
import { BusinessType, CronExpression, IContract } from "@framework/types";

import { LotteryScheduleDialog } from "./dialog";
import { UpgradeProductTypeDialog } from "../../../../../dialogs/product-type";

export interface ILotteryScheduleFullMenuItemProps {
  contract: IContract;
}

export const LotteryScheduleFullMenuItem: FC<ILotteryScheduleFullMenuItemProps> = props => {
  const {
    contract: { id },
  } = props;

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: `/lottery/rounds/${id}/schedule`,
      method: "POST",
      data: values,
    });
  });

  const handleSchedule = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleScheduleConfirm = async (values: Partial<any>, form: any) => {
    return fn(form, values).then(() => {
      setIsScheduleDialogOpen(false);
    });
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
      {process.env.BUSINESS_TYPE === (BusinessType.B2B as string) ? (
        <UpgradeProductTypeDialog open={isScheduleDialogOpen} onClose={handleScheduleCancel} />
      ) : (
        <LotteryScheduleDialog
          onConfirm={handleScheduleConfirm}
          onCancel={handleScheduleCancel}
          open={isScheduleDialogOpen}
          initialValues={{
            schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT,
          }}
        />
      )}
    </Fragment>
  );
};
