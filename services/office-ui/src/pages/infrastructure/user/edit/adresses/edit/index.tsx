import { FC } from "react";

import { IAddress } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";

import { AddressInput } from "../../../../../../components/inputs/address";
import { validationSchema } from "./validation";

export interface IUserAddressFormProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (item: IAddress, form: any) => Promise<void>;
  initialValues: IAddress;
}

export const UserAddressForm: FC<IUserAddressFormProps> = props => {
  const {
    initialValues: { id },
  } = props;
  return (
    <FormDialog validationSchema={validationSchema} message={id ? "dialogs.edit" : "dialogs.create"} {...props}>
      <AddressInput outlined={false} />
    </FormDialog>
  );
};
