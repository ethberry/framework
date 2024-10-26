import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput } from "@ethberry/mui-inputs-core";
import { TemplateAssetInput } from "@ethberry/mui-inputs-asset";
import { ContractFeatures, IMerge, ContractStatus, MergeStatus, ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IMergeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IMerge>, form: any) => Promise<void>;
  initialValues: IMerge;
}

export const MergeEditDialog: FC<IMergeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, mergeStatus } = initialValues;

  const fixedValues = {
    id,
    item,
    price,
    mergeStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="MergeEditForm"
      disabled={false}
      {...rest}
    >
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.mergePrice" />
      </Alert>
      <TemplateAssetInput
        required
        autoSelect
        prefix="price"
        contract={{
          data: {
            excludeFeatures: [ContractFeatures.EXTERNAL],
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          },
        }}
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] }}
        forceAmount
      />
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.mergeItem" />
      </Alert>
      <TemplateAssetInput
        required
        autoSelect
        prefix="item"
        contract={{
          data: {
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          },
        }}
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] }}
      />
      <SelectInput name="mergeStatus" options={MergeStatus} />
    </FormDialog>
  );
};
