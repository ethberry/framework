import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { IWhitelist } from "@framework/types";

import { validationSchema } from "./validation";

export interface IWhitelistEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWhitelist>, form: any) => Promise<void>;
  initialValues: IWhitelist;
}

export const WhitelistEditDialog: FC<IWhitelistEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, account } = initialValues;
  const fixedValues = {
    id,
    account,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="WhitelistEditDialog"
      {...rest}
    >
      <TextInput name="account" />
    </FormDialog>
  );
};
