import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IVestingTransferOwnershipDto {
  account: string;
}

export interface IVestingTransferOwnershipDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IVestingTransferOwnershipDto, form?: any) => Promise<void>;
  initialValues: IVestingTransferOwnershipDto;
}

export const VestingTransferOwnershipDialog: FC<IVestingTransferOwnershipDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.transfer"
      testId="VestingTransferOwnershipDialogDialogForm"
      {...rest}
    >
      <TextInput name="account" />
    </FormDialog>
  );
};
