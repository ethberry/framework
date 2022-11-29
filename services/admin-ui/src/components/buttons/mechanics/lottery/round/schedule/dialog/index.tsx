import { FC } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";

import { validationSchema } from "./validation";
import { CronExpression, ILotteryOption } from "@framework/types";

export interface ILotteryScheduleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ILotteryOption>, form: any) => Promise<void>;
  initialValues: ILotteryOption;
}

export const LotteryScheduleDialog: FC<ILotteryScheduleDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.schedule"
      testId="LotteryScheduleForm"
      {...rest}
    >
      <Alert severity="warning">
        <FormattedMessage id="form.hints.risk" />
      </Alert>
      <SelectInput name="schedule" options={CronExpression} />
      <RichTextEditor name="description" />
    </FormDialog>
  );
};
