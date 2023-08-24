import { FC, useMemo } from "react";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { NumberInput, TextInput } from "@gemunion/mui-inputs-core";

import { emptyShare } from "./empty";

export { emptyShare } from "./empty";

export interface IShareField {
  id: string;
  payee: string;
  share: number;
}

export interface ISharesInputProps {
  multiple?: boolean;
  name?: string;
  readOnly?: boolean;
}

export const SharesInput: FC<ISharesInputProps> = props => {
  const { name = "shares", multiple = true, readOnly } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({ name, control: form.control });
  const watchFields = useWatch({ name });
  const values: IShareField[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...watchFields[index],
      }) as IShareField,
  );

  const handleOptionAdd = (): (() => void) => (): void => {
    append(emptyShare);
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      remove(i);
    };

  return useMemo(
    () => (
      <Box mt={2}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Typography sx={{ mr: 1 }}>
            <FormattedMessage id={`form.labels.${name}`} />
          </Typography>
          {multiple ? (
            <Tooltip title={formatMessage({ id: "form.tips.create" })}>
              <IconButton size="small" aria-label="add" onClick={handleOptionAdd()}>
                <Add fontSize="large" color="primary" />
              </IconButton>
            </Tooltip>
          ) : null}
        </Box>

        {values?.map((o, i: number) => (
          <Box key={o.id} mt={1} mb={1} display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Paper sx={{ px: 2, py: 1, display: "flex", alignItems: "stretch", flex: 1, flexDirection: "column" }}>
                <TextInput name={`${name}[${i}].payee`} />
                <NumberInput name={`${name}[${i}].share`} inputProps={{ min: 1 }} />
              </Paper>
            </Box>

            {multiple && (
              <Box ml={2}>
                <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                  <span>
                    <IconButton aria-label="delete" onClick={handleOptionDelete(i)} disabled={!i}>
                      <Delete />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            )}
          </Box>
        ))}
      </Box>
    ),
    [readOnly, values],
  );
};
