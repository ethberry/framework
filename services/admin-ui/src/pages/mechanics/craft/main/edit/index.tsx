import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, SwitchInput } from "@gemunion/mui-inputs-core";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { CraftStatus, ICraft, ModuleType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IExchangeEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ICraft>, form: any) => Promise<void>;
  initialValues: ICraft;
}

export const CraftEditDialog: FC<IExchangeEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, item, price, craftStatus, inverse } = initialValues;

  const fixedValues = {
    craftStatus,
    id,
    item,
    price,
    inverse,
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
      <TemplateAssetInput
        autoSelect
        prefix="item"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        multiple
      />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        multiple
      />
      <SwitchInput name="inverse" />
      {id ? <SelectInput name="craftStatus" options={CraftStatus} /> : null}
    </FormDialog>
  );
};
