import { FC } from "react";
import { Grid, InputAdornment } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CheckboxInput, NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { IStakingRule } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../components/inputs/price";

export interface IStakingEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IStakingRule>, form: any) => Promise<void>;
  initialValues: IStakingRule;
}

export const StakingEditDialog: FC<IStakingEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, penalty, recurrent, deposit, reward, duration, stakingStatus } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    deposit,
    reward,
    penalty,
    recurrent,
    duration,
    stakingStatus,
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
      {id ? <TextInput name="stakingStatus" readOnly={true} /> : null}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <PriceInput prefix="deposit" />
        </Grid>
        <Grid item xs={6}>
          <PriceInput prefix="reward" />
        </Grid>
      </Grid>
      <NumberInput
        name="duration"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              <FormattedMessage id="form.adornment.days" />
            </InputAdornment>
          ),
        }}
      />
      <CurrencyInput
        name="penalty"
        symbol=""
        InputProps={{
          endAdornment: <InputAdornment position="start">%</InputAdornment>,
        }}
      />
      <CheckboxInput name="recurrent" />
    </FormDialog>
  );
};
