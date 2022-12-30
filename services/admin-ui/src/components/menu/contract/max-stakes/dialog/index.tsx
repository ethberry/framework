import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IStakesDto {
  maxStake: number;
}

export interface IStakesEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IStakesDto, form: any) => Promise<void>;
  initialValues: IStakesDto;
}

export const StakesEditDialog: FC<IStakesEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      testId="StakesEditForm"
      {...rest}
    >
      <NumberInput name="maxStake" />
    </FormDialog>
  );
};
