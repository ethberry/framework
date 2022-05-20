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

export interface IGrantRoleDto {
  role: string;
  address: string;
}

export interface IOzContractGrantRoleDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IGrantRoleDto, formikBag: any) => Promise<void>;
  initialValues: IGrantRoleDto;
}

export const OzContractGrantRoleDialog: FC<IOzContractGrantRoleDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      data-testid="OzContractGrantRoleDialog"
      {...rest}
    >
      <SelectInput name="role" options={OzRoles} />
      <TextInput name="address" />
    </FormDialog>
  );
};
