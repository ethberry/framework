import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export enum OzRoles {
  DEFAULT_ADMIN_ROLE = "DEFAULT_ADMIN_ROLE",
  MINTER_ROLE = "MINTER_ROLE",
  PAUSER_ROLE = "PAUSER_ROLE",
  SNAPSHOT_ROLE = "SNAPSHOT_ROLE",
}

export interface IRevokeRoleDto {
  role: string;
  address: string;
}

export interface IOzContractRevokeRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IRevokeRoleDto, formikBag: any) => Promise<void>;
  initialValues: IRevokeRoleDto;
}

export const OzContractRevokeRoleDialog: FC<IOzContractRevokeRoleDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      data-testid="OzContractRevokeRoleDialog"
      {...rest}
    >
      <SelectInput name="role" options={OzRoles} />
      <TextInput name="address" />
    </FormDialog>
  );
};
