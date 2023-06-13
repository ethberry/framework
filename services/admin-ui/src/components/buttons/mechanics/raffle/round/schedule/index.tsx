import { FC, Fragment, useState } from "react";
import { Button } from "@mui/material";
import { ManageHistory } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { emptyStateString } from "@gemunion/draft-js-utils";
import { useApiCall } from "@gemunion/react-hooks";

import { CronExpression } from "@framework/types";

import { RaffleScheduleDialog } from "./dialog";

export const RaffleScheduleButton: FC = () => {
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);

  const { fn } = useApiCall(async (api, values) => {
    return api.fetchJson({
      url: "/raffle/rounds/schedule",
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
      <Button
        variant="outlined"
        startIcon={<ManageHistory />}
        onClick={handleSchedule}
        data-testid="RaffleScheduleButton"
      >
        <FormattedMessage id="form.buttons.schedule" />
      </Button>
      <RaffleScheduleDialog
        onConfirm={handleScheduleConfirm}
        onCancel={handleScheduleCancel}
        open={isScheduleDialogOpen}
        initialValues={{
          address: "",
          schedule: CronExpression.EVERY_DAY_AT_MIDNIGHT,
          description: emptyStateString,
        }}
      />
    </Fragment>
  );
};