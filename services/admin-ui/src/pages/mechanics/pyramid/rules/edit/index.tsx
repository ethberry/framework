import { FC } from "react";
import { Alert, Box, Grid, InputAdornment } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { IPyramidRule, ModuleType } from "@framework/types";

import { validationSchema } from "./validation";
import { PriceInput } from "../../../../../components/inputs/price";

export interface IPyramidStakingEditDialogProps {
  open: boolean;
  readOnly?: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPyramidRule>, form: any) => Promise<void>;
  initialValues: IPyramidRule;
}

export const PyramidEditDialog: FC<IPyramidStakingEditDialogProps> = props => {
  const { initialValues, readOnly, ...rest } = props;

  const { id, title, description, penalty, deposit, reward, duration, contractId } = initialValues;
  const fixedValues = {
    id,
    title,
    description,
    deposit,
    reward,
    penalty,
    duration,
    contractId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PyramidStakingEditForm"
      {...rest}
    >
      <EntityInput
        name="contractId"
        controller="contracts"
        data={{
          contractModule: [ModuleType.PYRAMID],
        }}
        // readOnly={!!id}
      />
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
        <Grid item xs={6}>
          <PriceInput prefix="deposit" readOnly={readOnly} />
        </Grid>
        <Grid item xs={6}>
          <PriceInput prefix="reward" readOnly={readOnly} />
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
        readOnly={readOnly}
      />
      <CurrencyInput
        name="penalty"
        symbol=""
        InputProps={{
          endAdornment: <InputAdornment position="start">%</InputAdornment>,
        }}
        readOnly={readOnly}
      />
    </FormDialog>
  );
};
