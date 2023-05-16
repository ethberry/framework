import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Typography } from "@mui/material";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";

import type { IAchievementRule } from "@framework/types";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";
import { ContractInput } from "../../../../components/inputs/contract";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IAchievementRule>, form: any) => Promise<void>;
  initialValues: IAchievementRule;
}

export const AchievementRuleEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, achievementType, achievementStatus, contractId, item, eventType } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    achievementType,
    achievementStatus,
    contractId,
    item,
    eventType,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      // validationSchema={validationSchema}
      message={message}
      testId="AchievementRuleEditForm"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SelectInput name="achievementType" options={AchievementType} />
      <SelectInput
        name="achievementStatus"
        options={AchievementRuleStatus}
        disabledOptions={[AchievementRuleStatus.NEW]}
      />
      <ContractInput name="contractId" related="address" controller="contracts" />
      <SelectInput name="eventType" options={ContractEventType} />
      <Typography sx={{ mt: 2 }} variant="inherit">
        <FormattedMessage id="form.labels.achievementItem" />
      </Typography>
      <TemplateAssetInput multiple allowEmpty prefix="item" showLabel={false} />
    </FormDialog>
  );
};
