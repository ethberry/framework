import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import type { IAchievementRule } from "@framework/types";
import { AchievementType } from "@framework/types";

import { validationSchema } from "./validation";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IAchievementRule>, form: any) => Promise<void>;
  initialValues: IAchievementRule;
}

export const AchievementRuleEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, achievementType } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    achievementType,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="AchievementRuleEditForm"
      {...rest}
    >
      <SelectInput name="achievementType" options={AchievementType} readOnly />
      <TextInput name="title" />
      <RichTextEditor name="description" />
    </FormDialog>
  );
};
