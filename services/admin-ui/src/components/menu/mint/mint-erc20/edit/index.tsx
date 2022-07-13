import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IMintErc20TokenDto {
  address: string;
  recipient?: string;
  amount: string;
}

export interface IMintErc20TokenDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IMintErc20TokenDto, form: any) => Promise<void>;
  initialValues: IMintErc20TokenDto;
}

export const MintErc20TokenDialog: FC<IMintErc20TokenDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.mintToken"
      data-testid="MintErc20TokenDialog"
      {...rest}
    >
      <TextInput name="address" />
      <TextInput name="recipient" />
      <TextInput name="amount" />
    </FormDialog>
  );
};
