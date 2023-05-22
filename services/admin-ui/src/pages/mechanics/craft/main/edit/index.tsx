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

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.edit"
      testId="CraftEditForm"
      {...rest}
    >
      {id ? <SelectInput name="craftStatus" options={CraftStatus} disabledOptions={[CraftStatus.NEW]} /> : null}
      <TemplateAssetInput autoSelect prefix="item" contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }} />
      {/* all token types are available */}
      <TemplateAssetInput autoSelect prefix="price" multiple />
    </FormDialog>
  );
};
