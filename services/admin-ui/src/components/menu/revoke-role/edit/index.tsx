import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { AccessControlRoleType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IRevokeRoleDto {
  role: AccessControlRoleType;
  address: string;
}

export interface IAccessControlRevokeRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IRevokeRoleDto, form: any) => Promise<void>;
  initialValues: IRevokeRoleDto;
}

export const AccessControlRevokeRoleDialog: FC<IAccessControlRevokeRoleDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      data-testid="AccessControlRevokeRoleDialog"
      {...rest}
    >
      <SelectInput name="role" options={AccessControlRoleType} />
      <TextInput name="address" />
    </FormDialog>
  );
};
