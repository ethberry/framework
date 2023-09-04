import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { FormWatcher } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { IDismantle } from "@framework/types";
import { DismantleStatus, DismantleStrategy, ModuleType, TokenType } from "@framework/types";

import { validationSchemaCreate, validationSchemaEdit } from "./validation";
import { RarityMultiplierInput } from "./rarity-multiplier-input";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDismantle>, form: any) => Promise<void>;
  initialValues: IDismantle;
}

export const DismantleEditDialog: FC<IExchangeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, dismantleStatus, rarityMultiplier, dismantleStrategy } = initialValues;

  const fixedValues = {
    id,
    item,
    price,
    dismantleStatus,
    dismantleStrategy,
    rarityMultiplier,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={id ? validationSchemaEdit : validationSchemaCreate}
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
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20] }}
      />
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.dismantleItem" />
      </Alert>
      <TemplateAssetInput
        autoSelect
        prefix="item"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        tokenType={{ disabledOptions: [TokenType.NATIVE] }}
        multiple
      />
      <FormWatcher />
      <RarityMultiplierInput name="rarityMultiplier" />
      <SelectInput name="dismantleStrategy" options={DismantleStrategy} />
      {id ? <SelectInput name="dismantleStatus" options={DismantleStatus} /> : null}
    </FormDialog>
  );
};
