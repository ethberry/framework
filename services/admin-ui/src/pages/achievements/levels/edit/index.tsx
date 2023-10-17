import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { JsonInput, NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { IAchievementLevel } from "@framework/types";

import { validationSchema } from "./validation";

export interface IAchievementLevelEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IAchievementLevel>, form: any) => Promise<void>;
  initialValues: IAchievementLevel;
}

export const AchievementLevelEditDialog: FC<IAchievementLevelEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    item,
    amount,
    parameters,
    startTimestamp,
    endTimestamp,
    achievementRuleId,
    achievementLevel,
  } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    item,
    amount,
    achievementRuleId,
    parameters: JSON.stringify(parameters),
    achievementLevel,
    startTimestamp,
    endTimestamp,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="AchievementLevelEditForm"
      {...rest}
    >
      <EntityInput name="achievementRuleId" controller="achievements/rules" autoselect readOnly={!!id} />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <TemplateAssetInput
        allowEmpty
        autoSelect
        multiple
        prefix="item"
        // tokenType={{ disabledOptions: [TokenType.NATIVE] }}
      />
      <JsonInput name="metadata" />
      <NumberInput name="amount" />
      <NumberInput name="achievementLevel" />
      <DateInput name="startTimestamp" />
      <DateInput name="endTimestamp" />
    </FormDialog>
  );
};
