import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { FormWatcher } from "@gemunion/mui-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { IDismantle } from "@framework/types";
import { DismantleStatus, ModuleType, TokenType } from "@framework/types";

import { validationSchema } from "./validation";
import { RarityMultiplierInput } from "./rarity-multiplier-input";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IDismantle>, form: any) => Promise<void>;
  initialValues: IDismantle;
}

export const DismantleEditDialog: FC<IExchangeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, dismantleStatus, rarityMultiplier } = initialValues;

  const fixedValues = {
    id,
    item,
    price,
    dismantleStatus,
    rarityMultiplier,
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
      <TemplateAssetInput
        autoSelect
        prefix="item"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        tokenType={{ disabledOptions: [TokenType.NATIVE, TokenType.ERC20, TokenType.ERC1155] }}
      />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
        multiple
      />
      <FormWatcher />
      <RarityMultiplierInput name="rarityMultiplier" />
      {id ? <SelectInput name="dismantleStatus" options={DismantleStatus} /> : null}
    </FormDialog>
  );
};
