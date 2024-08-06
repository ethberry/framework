import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
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

  const { id, title, description, reward, amount, parameters, achievementRuleId, achievementLevel } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    reward,
    amount,
    achievementRuleId,
    parameters: JSON.stringify(parameters),
    achievementLevel,
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
      <NumberInput name="achievementLevel" />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <NumberInput name="amount" />
      <TemplateAssetInput
        autoSelect
        multiple
        prefix="reward"
        // tokenType={{ disabledOptions: [TokenType.NATIVE] }}
      />
      {/* <JsonInput name="parameters" /> */}
    </FormDialog>
  );
};
