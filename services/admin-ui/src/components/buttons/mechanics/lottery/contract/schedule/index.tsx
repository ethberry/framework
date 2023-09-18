import { FC, Fragment, useState } from "react";
import { ManageHistory } from "@mui/icons-material";

import { useApiCall } from "@gemunion/react-hooks";
import { ListAction, ListActionVariant } from "@framework/mui-lists";
import { BusinessType, CronExpression, IContract } from "@framework/types";

import { UpgradeProductTypeDialog } from "../../../../../dialogs/product-type";
import { LotteryScheduleDialog } from "./dialog";

export interface ILotteryScheduleFullButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  refreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const LotteryScheduleButton: FC<ILotteryScheduleFullButtonProps> = props => {
  const {
    className,
    contract: { id, parameters },
    disabled,
    refreshPage,
    variant,
  } = props;

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: `/lottery/contracts/${id}/schedule`,
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
        icon={ManageHistory}
        message="form.buttons.schedule"
        className={className}
        dataTestId="LotteryScheduleButton"
        disabled={disabled}
        variant={variant}
      />
      {process.env.BUSINESS_TYPE === BusinessType.B2B ? (
        <UpgradeProductTypeDialog open={isScheduleDialogOpen} onClose={handleScheduleCancel} />
      ) : (
        <LotteryScheduleDialog
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
