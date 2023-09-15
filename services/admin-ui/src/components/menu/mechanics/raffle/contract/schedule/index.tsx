import { FC, Fragment, useState } from "react";
import { ManageHistory } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import { BusinessType, CronExpression, IContract } from "@framework/types";

import { ListAction, ListActionVariant } from "../../../../../common/lists";
import { UpgradeProductTypeDialog } from "../../../../../dialogs/product-type";
import { RaffleScheduleDialog } from "./dialog";

export interface IRaffleScheduleFullMenuItemProps {
  contract: IContract;
  disabled?: boolean;
  refreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const RaffleScheduleMenuItem: FC<IRaffleScheduleFullMenuItemProps> = props => {
  const {
    contract: { id, parameters },
    disabled,
    refreshPage,
    variant,
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
      <ListAction
        onClick={handleSchedule}
        dataTestId="RaffleScheduleButton"
        icon={ManageHistory}
        message="form.buttons.schedule"
        disabled={disabled}
        variant={variant}
      />
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
