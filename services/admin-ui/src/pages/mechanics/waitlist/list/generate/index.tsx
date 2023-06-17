import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";

import { IAsset } from "@framework/types";

import { validationSchema } from "./validation";

export interface IWaitListGenerateDto {
  item: IAsset;
  listId: number;
}

export interface IWaitListEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IWaitListGenerateDto>, form: any) => Promise<void>;
  initialValues: IWaitListGenerateDto;
}

export const WaitListGenerateDialog: FC<IWaitListEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { item, listId } = initialValues;
  const fixedValues = {
    item,
    listId,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      testId="WaitListGenerateDialog"
      {...rest}
    >
      <TemplateAssetInput autoSelect multiple prefix="item" />
      <EntityInput name="listId" controller="waitlist/list" />
    </FormDialog>
  );
};
