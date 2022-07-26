import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { IPage, PageStatus } from "@framework/types";

import { validationSchema } from "./validation";

export interface IEditPageDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPage>, formikBag: any) => Promise<void>;
  initialValues: IPage;
}

export const PageEditDialog: FC<IEditPageDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, slug, pageStatus } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    slug,
    pageStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";
  const testIdPrefix = "PageEditForm";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      data-testid={testIdPrefix}
      {...rest}
    >
      <TextInput name="slug" data-testid={`${testIdPrefix}-slug`} />
      <TextInput name="title" data-testid={`${testIdPrefix}-title`} />
      <RichTextEditor name="description" data-testid={`${testIdPrefix}-description`} />
      {id ? <SelectInput name="pageStatus" options={PageStatus} data-testid={`${testIdPrefix}-pageStatus`} /> : null}
    </FormDialog>
  );
};
