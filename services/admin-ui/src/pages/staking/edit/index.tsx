import { FC } from "react";
import { Grid, InputAdornment } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { FormDialog } from "@gemunion/mui-dialog-form";
import { CheckboxInput, NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { IStaking } from "@framework/types";

import { validationSchema } from "./validation";
import { TokenTypeInput } from "./token-type-input";
import { CollectionInput } from "./collection-input";
import { AmountInput } from "./amount-input";
import { CriteriaInput } from "./criteria-input";

export interface IStakingEditDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IStaking>, form: any) => Promise<void>;
  initialValues: IStaking;
}

export const StakingEditDialog: FC<IStakingEditDialogProps> = props => {
  const { initialValues, ...rest } = props;

  const { id, title, description, penalty, recurrent, deposit, reward, duration } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    deposit,
    reward,
    penalty,
    recurrent,
    duration,
  };

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={"dialogs.edit"}
      data-testid="StakingEditDialog"
      {...rest}
    >
      <TextInput name="title" />
      <RichTextEditor name="description" />

      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TokenTypeInput prefix="deposit" />
          <CollectionInput prefix="deposit" />
          <CriteriaInput prefix="deposit" />
          <AmountInput prefix="deposit" />
        </Grid>
        <Grid item xs={6}>
          <TokenTypeInput prefix="reward" />
          <CollectionInput prefix="reward" />
          <CriteriaInput prefix="reward" />
          <AmountInput prefix="reward" />
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
