import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput } from "@gemunion/mui-inputs-core";
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
      <TemplateAssetInput autoSelect prefix="item" contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }} />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
        multiple
      />
      {id ? <SelectInput name="craftStatus" options={CraftStatus} /> : null}
    </FormDialog>
  );
};
