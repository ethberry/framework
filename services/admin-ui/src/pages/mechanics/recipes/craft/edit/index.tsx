import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { ICraft } from "@framework/types";
import { CraftStatus, ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
  onConfirm: (values: Partial<ICraft>, form: any) => Promise<void>;
  initialValues: ICraft;
}

export const CraftEditDialog: FC<IExchangeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, craftStatus } = initialValues;

  const fixedValues = {
    craftStatus,
    id,
    item,
    price,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="CraftEditForm"
      {...rest}
    >
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.craftItem" />
      </Alert>
      <TemplateAssetInput
        autoSelect
        prefix="item"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        tokenType={{ disabledOptions: [TokenType.NATIVE] }}
        multiple
      />
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.craftPrice" />
      </Alert>
      <TemplateAssetInput
        autoSelect
        prefix="price"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
        multiple
      />
      {id ? <SelectInput name="craftStatus" options={CraftStatus} /> : null}
    </FormDialog>
  );
};
