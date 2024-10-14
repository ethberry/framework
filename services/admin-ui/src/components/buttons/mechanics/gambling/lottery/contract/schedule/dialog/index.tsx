import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput } from "@ethberry/mui-inputs-core";

import { validationSchema } from "./validation";
import { CronExpression, ILotteryScheduleUpdateDto } from "@framework/types";

export interface ILotteryScheduleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ILotteryScheduleUpdateDto>, form: any) => Promise<void>;
  initialValues: ILotteryScheduleUpdateDto;
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
      <SelectInput name="schedule" options={CronExpression} />
    </FormDialog>
  );
};
