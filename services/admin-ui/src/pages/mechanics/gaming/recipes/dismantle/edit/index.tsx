import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { SelectInput } from "@ethberry/mui-inputs-core";
import { TemplateAssetInput } from "@ethberry/mui-inputs-asset";
import type { IDismantle } from "@framework/types";
import { ContractStatus, DismantleStatus, ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { StrategyInput } from "./strategy-input";
import { GrowthRateInput } from "./growth-rate-input";

export interface IDismantleEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDismantle>, form: any) => Promise<void>;
  initialValues: IDismantle;
}

export const DismantleEditDialog: FC<IDismantleEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, dismantleStatus, growthRate, dismantleStrategy } = initialValues;

  const fixedValues = {
    id,
    item,
    price,
    dismantleStatus,
    dismantleStrategy,
    growthRate,
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
        required
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
        required
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
      <StrategyInput name="dismantleStrategy" />
      <GrowthRateInput name="growthRate" />
      {id ? <SelectInput name="dismantleStatus" options={DismantleStatus} /> : null}
    </FormDialog>
  );
};
