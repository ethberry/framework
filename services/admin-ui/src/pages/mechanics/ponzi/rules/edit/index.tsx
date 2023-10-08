import { FC } from "react";
import { Alert, Box, Grid, InputAdornment } from "@mui/material";
import { FormattedMessage } from "react-intl";

import { CheckboxInput, NumberInput, TextInput } from "@gemunion/mui-inputs-core";
import { FormDialog } from "@gemunion/mui-dialog-form";
import { EntityInput } from "@gemunion/mui-inputs-entity";
import { RichTextEditor } from "@gemunion/mui-inputs-draft";
import { CurrencyInput } from "@gemunion/mui-inputs-mask";
import { TemplateAssetInput } from "@gemunion/mui-inputs-asset";
import { ContractStatus, IPonziRule, ModuleType } from "@framework/types";

import { DurationInput } from "../../../../../components/inputs/duration";
import { validationSchema } from "./validation";

export interface IPonziStakingEditDialogProps {
  open: boolean;
  readOnly?: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPonziRule>, form: any) => Promise<void>;
  initialValues: IPonziRule;
}

export const PonziEditDialog: FC<IPonziStakingEditDialogProps> = props => {
  const { initialValues, readOnly, ...rest } = props;

  const { id, title, description, penalty, maxCycles, deposit, reward, durationAmount, durationUnit, contractId } =
    initialValues;
  const fixedValues = {
    id,
    title,
    description,
    deposit,
    reward,
    penalty,
    maxCycles,
    durationAmount,
    durationUnit,
    contractId,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PonziStakingEditForm"
      {...rest}
    >
      <EntityInput
        name="contractId"
        controller="contracts"
        data={{
          contractModule: [ModuleType.PONZI],
          contractStatus: [ContractStatus.ACTIVE, ContractStatus.NEW],
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
                <FormattedMessage id="alert.editNotAllowed" />
              </Alert>
            </Box>
          </Grid>
        ) : null}
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            autoSelect
            prefix="deposit"
            readOnly={readOnly}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
            autoSelect
            prefix="reward"
            readOnly={readOnly}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY] } }}
          />
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
      <NumberInput name="maxCycles" />
      <CheckboxInput name="recurrent" readOnly={readOnly} />
    </FormDialog>
  );
};
