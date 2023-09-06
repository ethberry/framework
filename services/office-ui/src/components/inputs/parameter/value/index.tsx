import { FC } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";

import { ParameterType } from "@framework/types";
import { TextInput } from "@gemunion/mui-inputs-core";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { FormattedMessage, useIntl } from "react-intl";
import { Add, Delete } from "@mui/icons-material";

export type ParameterValue = {
  id: string;
  parameterValue: string;
};

export interface IParameterValuesInput {
  name?: string;
}

export const ParameterValuesInput: FC<IParameterValuesInput> = props => {
  const { name = "parameterValue" } = props;

  const { formatMessage } = useIntl();

  const form = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({ name, control: form.control });
  const watchFields = useWatch({ name });

  const parameterType = useWatch({ name: "parameterType" });
  if (parameterType !== ParameterType.ENUM) {
    return null;
  }

  const values: ParameterValue[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...watchFields[index],
      }) as ParameterValue,
  );

  const handleOptionAdd = (): (() => void) => (): void => {
    append({ parameterValue: "" });
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      remove(i);
    };

  return (
    <Box mt={2}>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Typography sx={{ mr: 1 }}>
          <FormattedMessage id={`form.labels.${name}`} />
        </Typography>
        <Tooltip title={formatMessage({ id: "form.tips.create" })}>
          <IconButton size="small" aria-label="add" onClick={handleOptionAdd()}>
            <Add fontSize="large" color="primary" />
          </IconButton>
        </Tooltip>
      </Box>

      {values?.map((p: ParameterValue, i: number) => (
        <Box key={p.id} mt={1} mb={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Paper sx={{ p: 2, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
              <TextInput name={`${name}[${i}].parameterValue`} />
            </Paper>
          </Box>

          <Box ml={2}>
            <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
              <span>
                <IconButton aria-label="delete" onClick={handleOptionDelete(i)} disabled={!i}>
                  <Delete />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
