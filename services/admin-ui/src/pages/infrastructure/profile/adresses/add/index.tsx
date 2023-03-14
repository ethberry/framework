import { FC } from "react";

import { IAddress } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SwitchInput, TextArea } from "@gemunion/mui-inputs-core";

import { addressValidationSchema } from "../../../../../components/validation";

export interface IAddUserDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (item: IAddress, form: any) => Promise<void>;
  initialValues: IAddress;
}

export const AddAddressDialog: FC<IAddUserDialogProps> = props => {
  // TODO check initialValues
  return (
    <FormDialog validationSchema={addressValidationSchema} message="dialogs.add" {...props}>
      <TextArea name="address" />
      <SwitchInput name="isDefault" />
    </FormDialog>
  );
};
