import { FC } from "react";

import { IAddress } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { AddressInput } from "../../../../../components/inputs/address";
import { validationSchema } from "./validation";

export interface IAddressEditDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (item: IAddress, form: any) => Promise<void>;
  initialValues: IAddress;
}

export const AddressEditDialog: FC<IAddressEditDialogProps> = props => {
  const {
    initialValues: { id },
  } = props;

  return (
    <FormDialog
      validationSchema={validationSchema}
      maxWidth="md"
      message={id ? "dialogs.edit" : "dialogs.create"}
      {...props}
    >
      <AddressInput />
    </FormDialog>
  );
};
