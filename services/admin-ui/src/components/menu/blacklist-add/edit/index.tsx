import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";

import { validationSchema } from "./validation";

export interface IBlacklistDto {
  address: string;
}

export interface IAccessListBlacklistDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IBlacklistDto, form: any) => Promise<void>;
  initialValues: IBlacklistDto;
}

export const AccessListBlacklistDialog: FC<IAccessListBlacklistDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.blacklist"
      data-testid="AccessListBlacklistDialog"
      {...rest}
    >
      <TextInput name="address" />
    </FormDialog>
  );
};
