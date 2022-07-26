import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { IClaim, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../components/inputs/price";

export interface IClaimEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IClaim>, form: any) => Promise<void>;
  initialValues: IClaim;
}

export const ClaimEditDialog: FC<IClaimEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, account } = initialValues;
  const fixedValues = {
    id,
    item,
    account,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";
  const testIdPrefix = "ClaimEditDialog";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      {...rest}
      data-testid={testIdPrefix}
    >
      <TextInput name="account" data-testid={`${testIdPrefix}-account`} />
      <PriceInput prefix="item" disabledTokenTypes={[TokenType.NATIVE, TokenType.ERC20]} />
    </FormDialog>
  );
};
