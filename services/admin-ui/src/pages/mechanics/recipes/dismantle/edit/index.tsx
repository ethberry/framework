import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { IDismantle } from "@framework/types";
import { DismantleStatus, ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDismantle>, form: any) => Promise<void>;
  initialValues: IDismantle;
}

export const DismantleEditDialog: FC<IExchangeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, dismantleStatus } = initialValues;

  const fixedValues = {
    dismantleStatus,
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
      testId="DismantleEditForm"
      {...rest}
    >
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.dismantlePrice" />
      </Alert>
      <TemplateAssetInput
        autoSelect
        prefix="price"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] }}
      />
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.dismantleItem" />
      </Alert>
      <TemplateAssetInput
        autoSelect
        prefix="item"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
        multiple
      />
      {id ? <SelectInput name="dismantleStatus" options={DismantleStatus} /> : null}
    </FormDialog>
  );
};
