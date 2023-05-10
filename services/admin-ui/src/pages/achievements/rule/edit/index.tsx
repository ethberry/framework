import { FC } from "react";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import type { IAchievementRule } from "@framework/types";
import { AchievementRuleStatus, AchievementType, ContractEventType } from "@framework/types";

import { validationSchema } from "./validation";
import { ContractInput } from "../../../../components/inputs/contract";

export interface IErc20TokenEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IAchievementRule>, form: any) => Promise<void>;
  initialValues: IAchievementRule;
}

export const AchievementRuleEditDialog: FC<IErc20TokenEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, achievementType, achievementStatus, contractId, eventType } = initialValues;

  const fixedValues = {
    id,
    title,
    description,
    achievementType,
    achievementStatus,
    contractId,
    eventType,
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
      <SelectInput name="achievementType" options={AchievementType} />
      <ContractInput
        name="contractId"
        related="address"
        controller="contracts"
        // data={{
        //   contractModule: [ModuleType.STAKING],
        // }}
      />
      <SelectInput name="eventType" options={ContractEventType} />
      <SelectInput name="achievementStatus" options={AchievementRuleStatus} />
    </FormDialog>
  );
};
