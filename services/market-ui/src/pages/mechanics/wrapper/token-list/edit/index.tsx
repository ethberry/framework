import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { TemplateInput } from "./template-input";
import { ContractInput } from "./contract-input";
import { PriceInput } from "../../../../../components/inputs/price";
import { ITokenAsset } from "../../../../../components/inputs/price/empty-price";

export interface ICreateWrappedToken {
  tokenType: TokenType;
  contract: {
    address: string;
  };
  contractId: number;
  templateId: number;
  item: ITokenAsset;
}

export interface IWrapperEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: ICreateWrappedToken, form: any) => Promise<void>;
  initialValues: ICreateWrappedToken;
}

export const WrapperEditDialog: FC<IWrapperEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { item, tokenType, contract, templateId } = initialValues;

  const fixedValues = { item, tokenType, contract, templateId };

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
      <PriceInput prefix="item" multiple />
    </FormDialog>
  );
};
