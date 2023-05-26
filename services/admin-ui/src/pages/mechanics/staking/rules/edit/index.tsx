import { FC } from "react";
import { Alert, Box, Grid, InputAdornment } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CheckboxInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { IStakingRule, ModuleType, StakingRuleStatus } from "@framework/types";

import { DurationInput } from "../../../../../components/inputs/duration";
import { validationSchema } from "./validation";

export interface IStakingRuleEditDialogProps {
  open: boolean;
  readOnly?: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IStakingRule>, form: any) => Promise<void>;
  initialValues: IStakingRule;
}

export const StakingRuleEditDialog: FC<IStakingRuleEditDialogProps> = props => {
  const { initialValues, readOnly, ...rest } = props;

  const {
    id,
    title,
    description,
    penalty,
    recurrent,
    deposit,
    reward,
    durationAmount,
    durationUnit,
    stakingRuleStatus,
    contractId,
  } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    deposit,
    reward,
    penalty,
    recurrent,
    durationAmount,
    durationUnit,
    stakingRuleStatus,
    contractId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="StakingEditForm"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />
      <SelectInput name="stakingRuleStatus" options={StakingRuleStatus} readOnly />
      <Grid container spacing={2}>
        {readOnly ? (
          <Grid item xs={12}>
            <Box mt={2}>
              <Alert severity="warning">
                <FormattedMessage id="form.hints.editNotAllowed" />
              </Alert>
            </Box>
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            autoSelect
            prefix="deposit"
            readOnly={readOnly}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY] } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            allowEmpty
            autoSelect
            prefix="reward"
            readOnly={readOnly}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY] } }}
          />
        </Grid>
      </Grid>
      <EntityInput
        name="contractId"
        controller="contracts"
        data={{
          contractModule: [ModuleType.STAKING],
        }}
        readOnly={!!id}
      />
      <DurationInput readOnly={readOnly} />
      <CurrencyInput
        name="penalty"
        symbol=""
        InputProps={{
          endAdornment: <InputAdornment position="start">%</InputAdornment>,
        }}
        readOnly={readOnly}
      />
      <CheckboxInput name="recurrent" readOnly={readOnly} />
    </FormDialog>
  );
};
