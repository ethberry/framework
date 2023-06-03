import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Alert, Box, Grid, InputAdornment } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CheckboxInput, TextInput, NumberInput } from "@gemunion/mui-inputs-core";

import { IStakingRule, ModuleType } from "@framework/types";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { validationSchema } from "./validation";
import { DurationInput } from "../../../../../inputs/duration";
import { ContractInput } from "../../../../../inputs/contract";

export interface IStakingRuleUploadDialogProps {
  open: boolean;
  readOnly?: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IStakingRule>, form?: any) => Promise<void>;
  initialValues: Partial<IStakingRule>;
}

export const StakingRuleUploadDialog: FC<IStakingRuleUploadDialogProps> = props => {
  const { initialValues, readOnly, ...rest } = props;

  const { id, title, contract, description, penalty, recurrent, deposit, reward, maxStake, durationAmount, durationUnit } =
    initialValues;
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
    contract,
    maxStake,
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
      {id ? <TextInput name="title" /> : null}
      {id ? <RichTextEditor name="description" /> : null}
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
            multiple
            prefix="deposit"
            readOnly={readOnly}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY] } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            allowEmpty
            autoSelect
            multiple
            prefix="reward"
            readOnly={readOnly}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY] } }}
          />
        </Grid>
      </Grid>
      <ContractInput
        name="contractId"
        related="address"
        controller="contracts"
        data={{
          contractModule: [ModuleType.STAKING],
        }}
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
      <NumberInput name="maxStake" readOnly={readOnly} />
      <CheckboxInput name="recurrent" readOnly={readOnly} />
    </FormDialog>
  );
};
