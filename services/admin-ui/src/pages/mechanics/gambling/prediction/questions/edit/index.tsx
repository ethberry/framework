import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { IPredictionQuestion, PredictionQuestionStatus, TokenType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IRaffleEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPredictionQuestion>, form: any) => Promise<void>;
  initialValues: Partial<IPredictionQuestion>;
}

export const PredictionQuestionEditDialog: FC<IRaffleEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, questionStatus, price } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    questionStatus,
    price,
  };
  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PredictionQuestionEditForm"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TemplateAssetInput
        autoSelect
        prefix="price"
        tokenType={{ disabledOptions: [TokenType.ERC721, TokenType.ERC998] }}
      />
      {id ? <SelectInput name="questionStatus" options={PredictionQuestionStatus} /> : null}
    </FormDialog>
  );
};
