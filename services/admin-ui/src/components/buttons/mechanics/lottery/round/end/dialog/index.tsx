import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";

import { ILotteryOption } from "@framework/types";

import { ContractInput } from "../../contract-input";
import { validationSchema } from "./validation";

export interface ILotteryEndRound {
  address: string;
}

export interface ILotteryEndRoundDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ILotteryEndRound, form?: any) => Promise<void>;
  // todo better interface
  initialValues: ILotteryEndRound;
}

export const LotteryEndRoundDialog: FC<ILotteryEndRoundDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.endRound"
      testId="LotteryScheduleForm"
      {...rest}
    >
      <ContractInput />
    </FormDialog>
  );
};
