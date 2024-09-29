import { FC, Fragment, useState } from "react";
import { ManageHistory } from "@mui/icons-material";

import { useApiCall } from "@ethberry/react-hooks";
import { ListAction, ListActionVariant } from "@framework/styled";
import { BusinessType, CronExpression, IContract } from "@framework/types";

import { shouldDisableByContractType } from "../../../../utils";
import { RaffleScheduleDialog } from "./dialog";

export interface IRaffleScheduleFullButtonProps {
  className?: string;
  contract: IContract;
  disabled?: boolean;
  refreshPage: () => Promise<void>;
  variant?: ListActionVariant;
}

export const RaffleScheduleButton: FC<IRaffleScheduleFullButtonProps> = props => {
  const {
    className,
    contract,
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
        icon={ManageHistory}
        message="form.buttons.schedule"
        className={className}
        dataTestId="RaffleScheduleButton"
        disabled={disabled || shouldDisableByContractType(contract) || process.env.BUSINESS_TYPE === BusinessType.B2B}
        variant={variant}
      />
      <RaffleScheduleDialog
        onConfirm={handleScheduleConfirm}
        onCancel={handleScheduleCancel}
        open={isScheduleDialogOpen}
        initialValues={{
          schedule: parameters.schedule as CronExpression,
        }}
      />
    </Fragment>
  );
};
