import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { emptyStateString } from "@gemunion/draft-js-utils";
import { IContract, INativeContractCreateDto } from "@framework/types";

import { validationSchema } from "./validation";

export interface INativeContractCreateDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IContract>, form: any) => Promise<void>;
}

export const NativeContractCreateDialog: FC<INativeContractCreateDialogProps> = props => {
  const fixedValues: INativeContractCreateDto = {
    symbol: "",
    title: "",
    description: emptyStateString,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message="dialogs.create"
      testId="NativeContractCreateForm"
      {...props}
    >
      <TextInput name="symbol" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
    </FormDialog>
  );
};
