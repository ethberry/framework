import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { JsonInput, NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { IAchievementLevel, TokenType } from "@framework/types";

// TODO Validation
// import { validationSchema } from "./validation";

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
    attributes,
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
    attributes: JSON.stringify(attributes),
    achievementLevel,
    startTimestamp,
    endTimestamp,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      // validationSchema={validationSchema}
      message={message}
      testId="AchievementLevelEditForm"
      {...rest}
    >
      <EntityInput name="achievementRuleId" controller="achievements/rules" autoselect readOnly={!!id} />
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <Typography sx={{ mt: 2 }} variant="inherit">
        <FormattedMessage id="form.labels.achievementLevelItem" />
      </Typography>
      <TemplateAssetInput
        allowEmpty
        autoSelect
        multiple
        prefix="item"
        showLabel={false}
        // tokenType={{ disabledOptions: [TokenType.NATIVE] }}
      />
      <JsonInput name="attributes" />
      <Typography variant="inherit">
        <FormattedMessage id="form.labels.amount" />
      </Typography>
      <NumberInput name="amount" showLabel={false} />
      <Typography variant="inherit">
        <FormattedMessage id="form.labels.achievementLevel" />
      </Typography>
      <NumberInput name="achievementLevel" showLabel={false} />
      <DateInput name="startTimestamp" />
      <DateInput name="endTimestamp" />
    </FormDialog>
  );
};
