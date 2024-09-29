import { FC } from "react";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { TextInput } from "@ethberry/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IBreedLimitDto {
  count: number;
  time: number;
  maxTime: number;
}

export interface IBreedLimitDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IBreedLimitDto, form: any) => Promise<void>;
  initialValues: IBreedLimitDto;
}

export const BreedLimitDialog: FC<IBreedLimitDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.breedLimit"
      testId="BreedLimitForm"
      {...rest}
    >
      <TextInput name="count" />
      <TextInput name="time" />
      <TextInput name="maxTime" />
    </FormDialog>
  );
};
