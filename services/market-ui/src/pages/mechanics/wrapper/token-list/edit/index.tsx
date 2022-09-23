import { FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { IAssetComponent, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../components/inputs/price";
import { TemplateInput } from "./template-input";
import { ContractInput } from "./contract-input";

export interface ITokenAssetComponent extends IAssetComponent {
  token: { tokenId?: string };
}

export interface ITokenAsset {
  components: Array<ITokenAssetComponent>;
}

export interface ICreateWrappedToken {
  tokenType: TokenType;
  contract: {
    address: string;
  };
  contractId: number;
  templateId: number;
  item: ITokenAsset;
}

export const emptyItems = {
  components: [
    {
      tokenType: TokenType.NATIVE,
      contractId: 0,
      contract: {
        decimals: 18,
        contractType: TokenType.NATIVE,
      },
      templateId: 0,
      template: {
        title: "",
      },
      amount: "0",
      token: { tokenId: "0" },
    } as ITokenAssetComponent,
  ],
} as ITokenAsset;

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
