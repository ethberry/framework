import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Typography } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { DateInput } from "@gemunion/mui-inputs-picker";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { IAchievementRule } from "@framework/types";
import { AchievementRuleStatus, ContractFeatures, ContractStatus } from "@framework/types";

import { ContractInput } from "./contract";
import { validationSchema } from "./validation";
import { SelectContractEventTypeInput } from "./contract-event-type-select";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IAchievementRule>, form: any) => Promise<void>;
  initialValues: IAchievementRule;
}

export const AchievementRuleEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const {
    id,
    title,
    description,
    achievementStatus,
    contractId,
    contract,
    item,
    eventType,
    startTimestamp,
    endTimestamp,
  } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    achievementStatus,
    contractId,
    contract,
    item,
    eventType,
    startTimestamp,
    endTimestamp,
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
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <ContractInput
        name="contractId"
        related="address"
        controller="contracts"
        data={{ excludeFeatures: [ContractFeatures.EXTERNAL], contractStatus: [ContractStatus.ACTIVE] }}
      />
      <SelectContractEventTypeInput />
      <Typography sx={{ mt: 2 }} variant="inherit">
        <FormattedMessage id="form.labels.achievementItem" />
      </Typography>
      <TemplateAssetInput autoSelect multiple prefix="item" showLabel={false} />
      <DateInput name="startTimestamp" />
      <DateInput name="endTimestamp" />
      <SelectInput name="achievementStatus" options={AchievementRuleStatus} />
    </FormDialog>
  );
};
