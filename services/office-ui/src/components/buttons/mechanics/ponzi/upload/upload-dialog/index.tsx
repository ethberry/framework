import { FC } from "react";
import { FormattedMessage } from "react-intl";

import { Alert, Box, Grid, InputAdornment } from "@mui/material";

import { FormDialog } from "@ethberry/mui-dialog-form";
import { NumberInput, TextInput } from "@ethberry/mui-inputs-core";
import type { IPonziRule } from "@framework/types";
import { ModuleType } from "@framework/types";
import { RichTextEditor } from "@ethberry/mui-inputs-draft";
import { CurrencyInput } from "@ethberry/mui-inputs-mask";
import { TemplateAssetInput } from "@ethberry/mui-inputs-asset";

import { validationSchema } from "./validation";
import { DurationInput } from "../../../../../inputs/duration";
import { ContractInput } from "../../../../../inputs/contract";

export interface IPonziRuleUploadDialogProps {
  open: boolean;
  readOnly?: boolean;
  onCancel: () => void;
  onConfirm: (values: Partial<IPonziRule>, form?: any) => Promise<void>;
  initialValues: Partial<IPonziRule>;
}

export const PonziRuleUploadDialog: FC<IPonziRuleUploadDialogProps> = props => {
  const { initialValues, readOnly, ...rest } = props;

  const { id, title, contract, description, penalty, deposit, reward, durationAmount, durationUnit, maxCycles } =
    initialValues;
  const fixedValues = {
    id,
    title,
    description,
    deposit,
    reward,
    penalty,
    durationAmount,
    durationUnit,
    contract,
    maxCycles,
  };

  const message = id ? "dialogs.edit" : "dialogs.create";

  return (
    <FormDialog
      initialValues={fixedValues}
      validationSchema={validationSchema}
      message={message}
      testId="PonziEditForm"
      {...rest}
    >
      {id ? <TextInput name="title" /> : null}
      {id ? <RichTextEditor name="description" /> : null}
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
            readOnly={readOnly}
            contract={{ data: { contractModule: [ModuleType.HIERARCHY, ModuleType.MYSTERY] } }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TemplateAssetInput
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
          contractModule: [ModuleType.PONZI],
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
      <NumberInput name="maxCycles" readOnly={readOnly} />
    </FormDialog>
  );
};
