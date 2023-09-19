import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IRoyaltyDto {
  royalty: number;
}

export interface IRoyaltyEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IRoyaltyDto, form: any) => Promise<void>;
  initialValues: IRoyaltyDto;
}

export const RoyaltyEditDialog: FC<IRoyaltyEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      testId="RoyaltyEditForm"
      disabled={false}
      {...rest}
    >
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
