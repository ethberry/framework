import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { ContractAddressInput } from "@gemunion/mui-inputs-entity";
import { AccessControlRoleType } from "@framework/types";

import { validationSchema } from "./validation";

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

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.grantRole"
      testId="AccessControlGrantRoleForm"
      {...rest}
    >
      <SelectInput name="role" options={AccessControlRoleType} />
      <ContractAddressInput name="address" targetId="address" controller="contracts" freeSolo />
    </FormDialog>
  );
};
