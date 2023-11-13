import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Alert, Box, Grid, InputAdornment } from "@mui/material";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CheckboxInput, NumberInput } from "@gemunion/mui-inputs-core";
import type { IStakingRule } from "@framework/types";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ModuleType } from "@framework/types";

import { DurationInput } from "../../../../../inputs/duration";
import { ContractInput } from "../../../../../inputs/contract";
import { validationSchema } from "./validation";

export interface IStakingRuleUploadDialogProps {
  open: boolean;
  readOnly?: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IStakingRule>, form?: any) => Promise<void>;
  initialValues: Partial<IStakingRule>;
}

export const StakingRuleUploadDialog: FC<IStakingRuleUploadDialogProps> = props => {
  const { initialValues, readOnly, ...rest } = props;

  const { contract, penalty, recurrent, deposit, reward, maxStake, durationAmount, durationUnit } = initialValues;
  const fixedValues = {
    deposit,
    reward,
    penalty,
    recurrent,
    durationAmount,
    durationUnit,
    contract,
    maxStake,
  };

  const message = "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="StakingEditForm"
      disabled={false}
      {...rest}
    >
      <Grid container spacing={2}>
        {readOnly ? (
          <Grid item xs={12}>
            <Box mt={2}>
              <Alert severity="warning">
                <FormattedMessage id="alert.editNotAllowed" />
              </Alert>
            </Box>
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            autoSelect
            multiple
            prefix="deposit"
            allowEmpty={true}
            disableClear={false}
            readOnly={readOnly}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY] } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            autoSelect={false}
            multiple
            prefix="reward"
            readOnly={readOnly}
            allowEmpty={true}
            disableClear={false}
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
