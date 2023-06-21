import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";
import { IContract, IRaffleConfigDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface IRaffleDeployDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
  initialValues: IRaffleConfigDto;
}

export const RaffleDeployDialog: FC<IRaffleDeployDialogProps> = props => {
  return (
    <FormDialog message="dialogs.deploy" testId="RaffleDeployForm" validationSchema={validationSchema} {...props}>
      <NumberInput name="timeLagBeforeRelease" />
      <NumberInput name="commission" />
    </FormDialog>
  );
};
