import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";

import { CronExpression } from "@framework/types";
import { ContractInput } from "../../contract-input";
// import { validationSchema } from "./validation";
interface ILotteryScheduleUpdate {
  address: string;
  schedule: CronExpression;
  description?: string;
}
export interface ILotteryScheduleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ILotteryScheduleUpdate>, form: any) => Promise<void>;
  initialValues: ILotteryScheduleUpdate;
}

export const LotteryScheduleDialog: FC<ILotteryScheduleDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      // validationSchema={validationSchema}
      message="dialogs.schedule"
      testId="LotteryScheduleForm"
      {...rest}
    >
      <ContractInput />
      <SelectInput name="schedule" options={CronExpression} />
      <RichTextEditor name="description" />
    </FormDialog>
  );
};
