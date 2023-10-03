import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { FormWatcher } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { IDismantle } from "@framework/types";
import { ContractStatus, DismantleStatus, ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { RarityMultiplierInput } from "./rarity-multiplier-input";
import { StrategyInput } from "./strategy-input";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: (form?: any) => void;
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
      validationSchema={validationSchema}
      message={message}
      testId="DismantleEditForm"
      disabled={false}
      {...rest}
    >
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.dismantlePrice" />
      </Alert>
      <TemplateAssetInput
        autoSelect
        prefix="price"
        contract={{
          data: {
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          },
        }}
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20] }}
      />
      <Alert severity="info" sx={{ mt: 2 }}>
        <FormattedMessage id="alert.dismantleItem" />
      </Alert>
      <TemplateAssetInput
        autoSelect
        prefix="item"
        contract={{
          data: {
            contractModule: [ModuleType.HIERARCHY],
            contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
          },
        }}
        tokenType={{ disabledOptions: [TokenType.NATIVE] }}
        multiple
      />
      <FormWatcher />
      <StrategyInput name="dismantleStrategy" />
      <RarityMultiplierInput name="rarityMultiplier" />
      {id ? <SelectInput name="dismantleStatus" options={DismantleStatus} /> : null}
    </FormDialog>
  );
};
