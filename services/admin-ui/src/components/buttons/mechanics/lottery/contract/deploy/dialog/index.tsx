import { FC } from "react";
import { Alert } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";
import type { IContract, ILotteryConfigDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface ILotteryContractDeployDialogProps {
  open: boolean;
  onCancel: (form: any) => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: ILotteryConfigDto;
}

export const LotteryContractDeployDialog: FC<ILotteryContractDeployDialogProps> = props => {
  return (
    <FormDialog
      message="dialogs.deploy"
      testId="LotteryContractDeployForm"
      validationSchema={validationSchema}
      disabled={false}
      {...props}
    >
      <Alert severity="warning" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.minterRole" />
      </Alert>
      <NumberInput name="timeLagBeforeRelease" />
      <NumberInput name="commission" />
    </FormDialog>
  );
};
