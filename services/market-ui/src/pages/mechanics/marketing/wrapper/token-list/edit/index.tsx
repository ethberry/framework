import { FC } from "react";
import { FormDialog } from "@ethberry/mui-dialog-form";
import type { ITokenAsset } from "@ethberry/mui-inputs-asset";
import { TokenAssetInput } from "@ethberry/mui-inputs-asset";
import { ModuleType, TokenType } from "@framework/types";
import { TemplateInput } from "./template-input";
import { validationSchema } from "./validation";
import { ContractInput } from "../../../../../../components/inputs/contract";

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

  const { item, tokenType, templateId } = initialValues;

  const fixedValues = { item, tokenType, templateId };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      testId="WrapperEditForm"
      {...rest}
    >
      <ContractInput
        name="contractId"
        data={{
          contractModule: [ModuleType.WRAPPER],
          contractType: [TokenType.ERC721],
        }}
      />
      <TemplateInput autoselect />
      <TokenAssetInput prefix="item" multiple />
    </FormDialog>
  );
};
