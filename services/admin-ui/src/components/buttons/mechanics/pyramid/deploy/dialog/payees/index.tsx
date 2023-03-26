import { FC } from "react";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";

import { TextInput } from "@gemunion/mui-inputs-core";

import { emptyPayee } from "./empty";

export { emptyPayee } from "./empty";

export interface IPayeeField {
  id: string;
  payee: string;
}

export interface IPayeesInputProps {
  multiple?: boolean;
  name?: string;
  readOnly?: boolean;
}

export const PayeesInput: FC<IPayeesInputProps> = props => {
  const { name = "payees", multiple = true } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const { fields, append, remove } = useFieldArray({ name, control: form.control });
  const watchFields = useWatch({ name });
  const values: IPayeeField[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...watchFields[index],
      } as IPayeeField),
  );

  const handleOptionAdd = (): (() => void) => (): void => {
    append(emptyPayee);
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
  );
};
