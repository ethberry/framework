import { FC } from "react";
import { Alert, Box, Grid, InputAdornment } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CheckboxInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { IStakingRule } from "@framework/types";

import { DurationInput } from "../../../../../components/inputs/duration";
import { validationSchema } from "./validation";

export interface IStakingEditDialogProps {
  open: boolean;
  readOnly?: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IStakingRule>, form: any) => Promise<void>;
  initialValues: IStakingRule;
}

export const StakingEditDialog: FC<IStakingEditDialogProps> = props => {
  const { initialValues, readOnly, ...rest } = props;

  const { id, title, description, penalty, recurrent, deposit, reward, durationAmount, durationUnit } = initialValues;
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
          <TemplateAssetInput prefix="deposit" readOnly={readOnly} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput prefix="reward" readOnly={readOnly} />
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
    </FormDialog>
  );
};
