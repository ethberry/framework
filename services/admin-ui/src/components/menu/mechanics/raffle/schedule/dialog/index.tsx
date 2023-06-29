import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";

import { validationSchema } from "./validation";
import { CronExpression, IRaffleScheduleUpdateDto } from "@framework/types";

export interface IRaffleScheduleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IRaffleScheduleUpdateDto>, form: any) => Promise<void>;
  initialValues: IRaffleScheduleUpdateDto;
}

export const RaffleScheduleDialog: FC<IRaffleScheduleDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.schedule"
      testId="RaffleScheduleForm"
      {...rest}
    >
      <SelectInput name="schedule" options={CronExpression} />
      <RichTextEditor name="description" />
    </FormDialog>
  );
};
