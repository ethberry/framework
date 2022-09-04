import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { IAsset, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../components/inputs/price";
import { TemplateInput } from "./template-input";
import { ContractInput } from "./contract-input";

export interface ICreateWrappedToken {
  tokenType: TokenType;
  address: string;
  contractId: number;
  templateId: number;
  item: IAsset;
}

export interface IWrapperEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ICreateWrappedToken, form: any) => Promise<void>;
  initialValues: ICreateWrappedToken;
}

export const WrapperEditDialog: FC<IWrapperEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { item } = initialValues;

  const fixedValues = { item };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      testId="WrapperEditForm"
      {...rest}
    >
      <ContractInput />
      <TemplateInput />
      <PriceInput prefix="item" />
    </FormDialog>
  );
};
