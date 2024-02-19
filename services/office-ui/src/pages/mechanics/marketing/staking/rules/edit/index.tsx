import { FC } from "react";
import { Alert, Box, Grid, InputAdornment } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CheckboxInput, SelectInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { AvatarInput } from "@gemunion/mui-inputs-image-firebase";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import type { IStakingRule } from "@framework/types";
import { StakingRuleStatus } from "@framework/types";

import { DurationInput } from "../../../../../../components/inputs/duration";
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
    imageUrl,
    description,
    penalty,
    recurrent,
    deposit,
    reward,
    durationAmount,
    durationUnit,
    stakingRuleStatus,
  } = initialValues;
  const fixedValues = {
    id,
    title,
    imageUrl,
    description,
    deposit,
    reward,
    penalty,
    recurrent,
    durationAmount,
    durationUnit,
    stakingRuleStatus,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="StakingEditForm"
      disabled={false}
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
                <FormattedMessage id="alert.editNotAllowed" />
              </Alert>
            </Box>
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput autoSelect prefix="deposit" readOnly={readOnly} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput autoSelect prefix="reward" readOnly={readOnly} />
        </Grid>
      </Grid>
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
      <AvatarInput name="imageUrl" />
    </FormDialog>
  );
};
