import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { IAirdrop, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
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

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      {...rest}
      data-testid="AirdropEditDialog"
    >
      <TextInput name="account" />
      <PriceInput prefix="item" disabledOptions={[TokenType.NATIVE, TokenType.ERC20]} />
    </FormDialog>
  );
};
