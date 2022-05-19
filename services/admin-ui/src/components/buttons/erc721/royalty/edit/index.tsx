import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";

import { validationSchema } from "./validation";

export interface IRoyaltyDto {
  royalty: number;
}

export interface IEditErc721CollectionRoyaltyDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: IRoyaltyDto, formikBag: any) => Promise<void>;
  initialValues: IRoyaltyDto;
}

export const Erc721CollectionRoyaltyEditDialog: FC<IEditErc721CollectionRoyaltyDialogProps> = props => {
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
