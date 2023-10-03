import { ChangeEvent, FC } from "react";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { ITokenAsset, TokenAssetInput } from "@gemunion/mui-inputs-asset";
import { ModuleType, TokenType } from "@framework/types";

import { CommonContractInput } from "../../../../../components/inputs/common-contract";
import { TemplateInput } from "./template-input";
import { validationSchema } from "./validation";

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
  onCancel: (form?: any) => void;
  onConfirm: (values: ICreateWrappedToken, form: any) => Promise<void>;
  initialValues: ICreateWrappedToken;
}

export const WrapperEditDialog: FC<IWrapperEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { item, tokenType, contract, templateId } = initialValues;

  const fixedValues = { item, tokenType, contract, templateId };

  const handleContractChange =
    (form: any) =>
    (_event: ChangeEvent<unknown>, option: any): void => {
      form.setValue("contractId", option?.id ?? 0, { shouldDirty: true });
      form.setValue("contract.address", option?.address ?? "0x");
      form.setValue("contract.decimals", option?.decimals ?? 0);
    };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      testId="WrapperEditForm"
      {...rest}
    >
      <CommonContractInput
        name="contractId"
        data={{ contractModule: [ModuleType.WRAPPER] }}
        onChange={handleContractChange}
        withTokenType
      />
      <TemplateInput />
      <TokenAssetInput prefix="item" multiple />
    </FormDialog>
  );
};
