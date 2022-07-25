import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IRoyaltyDto {
  royalty: number;
}

export interface IErc721ContractRoyaltyEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IRoyaltyDto, form: any) => Promise<void>;
  initialValues: IRoyaltyDto;
}

export const Erc721ContractRoyaltyEditDialog: FC<IErc721ContractRoyaltyEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  return (
    <FormDialog
      initialValues={initialValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      data-testid="Erc721CollectionRoyaltyEditDialog"
      {...rest}
    >
      <CurrencyInput name="royalty" symbol="%" />
    </FormDialog>
  );
};
