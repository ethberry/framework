import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";
import { AccessControlRoleType } from "@framework/types";

export interface IGrantRoleDto {
  role: AccessControlRoleType;
  address: string;
}

export interface IAccessControlGrantRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IGrantRoleDto, form: any) => Promise<void>;
  initialValues: IGrantRoleDto;
}

export const AccessControlGrantRoleDialog: FC<IAccessControlGrantRoleDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const testIdPrefix = "AccessControlGrantRoleForm";

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.grantRole"
      testId={testIdPrefix}
      {...rest}
    >
      <SelectInput name="role" options={AccessControlRoleType} />
      <TextInput name="address" />
    </FormDialog>
  );
};
