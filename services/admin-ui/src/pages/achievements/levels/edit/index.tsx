import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { IAchievementLevel } from "@framework/types";

import { createValidationSchema, editValidationSchema } from "./validation";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IAchievementLevel>, form: any) => Promise<void>;
  initialValues: IAchievementLevel;
}

export const AchievementLevelEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, amount } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    amount,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={id ? editValidationSchema : createValidationSchema}
      message={message}
      testId="AchievementLevelEditForm"
      {...rest}
    >
      <EntityInput name="achievementRuleId" controller="achievements/rules" autoselect readOnly={!!id} />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <NumberInput name="amount" />
    </FormDialog>
  );
};
