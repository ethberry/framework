import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { IAirdrop } from "@framework/types";

import { validationSchema, validationSchema2 } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IAirdropEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IAirdrop>, form: any) => Promise<void>;
  initialValues: IAirdrop;
}

export const AirdropEditDialog: FC<IAirdropEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, account } = initialValues;
  const fixedValues = {
    id,
    item,
    account,
  };

  if (id) {
    return (
      <FormDialog
        initialValues={fixedValues}
        validationSchema={validationSchema}
        message="dialogs.edit"
        {...rest}
        data-testid="AirdropEditDialog"
      >
        <TextInput name="owner" />
        <PriceInput prefix="item" />
      </FormDialog>
    );
  }

  return (
    <FormDialog
      initialValues={{ list: [fixedValues] }}
      validationSchema={validationSchema2}
      message="dialogs.create"
      data-testid="AirdropAddDialog"
      {...rest}
    >
      <TextInput name="owner" />
      <PriceInput prefix="item" />
    </FormDialog>
  );
};
