import { FC } from "react";
import { useIntl } from "react-intl";

import type { ICategory } from "@framework/types";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";

import { validationSchema } from "./validation";

export interface IEditCategoryDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<ICategory>, form: any) => Promise<void>;
  initialValues: ICategory;
}

export const EditCategoryDialog: FC<IEditCategoryDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { formatMessage } = useIntl();

  const { id, title, description, parentId } = initialValues;
  const fixedValues = { id, title, description, parentId };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog initialValues={fixedValues} validationSchema={validationSchema} message={message} {...rest}>
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <EntityInput
        name="parentId"
        controller="ecommerce/categories"
        label={formatMessage({ id: "form.labels.parentCategoryId" })}
        placeholder={formatMessage({ id: "form.placeholders.parentCategoryId" })}
      />
    </FormDialog>
  );
};
