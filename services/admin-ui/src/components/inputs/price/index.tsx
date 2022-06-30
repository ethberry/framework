import { FC } from "react";
import { get, useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { emptyPrice } from "../empty-price";
import { TokenTypeInput } from "./token-type-input";
import { UniContractInput } from "./uni-contract-input";
import { UniTokenInput } from "./uni-token-input";
import { AmountInput } from "./amount-input";

export interface IStakingEditDialogProps {
  prefix: string;
  multiple?: boolean;
}

export const PriceInput: FC<IStakingEditDialogProps> = props => {
  const { prefix, multiple = false } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const nestedPrefix = `${prefix}.components`;

  const value = get(useWatch(), nestedPrefix);

  const handleOptionAdd = (): (() => void) => (): void => {
    const newValue = get(form.getValues(), nestedPrefix);
    newValue.push(emptyPrice.components[0]);
    form.setValue(nestedPrefix, newValue);
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
      (): void => {
        const newValue = get(form.getValues(), nestedPrefix);
        newValue.splice(i, 1);
        form.setValue(nestedPrefix, newValue);
      };

  return (
    <Box mt={2}>
      <Typography>Price</Typography>

      {value?.map((_o: any, i: number) => (
        <Box mt={1} mb={1} display="flex" justifyContent="space-between" alignItems="center">
          <Box flex={1}>
            <Paper sx={{ p: 2 }}>
              <TokenTypeInput prefix={`${nestedPrefix}[${i}]`} />
              <UniContractInput prefix={`${nestedPrefix}[${i}]`} />
              <UniTokenInput prefix={`${nestedPrefix}[${i}]`} />
              <AmountInput prefix={`${nestedPrefix}[${i}]`} />
            </Paper>
          </Box>

          <Box ml={2}>
            {multiple && (
              <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                <IconButton aria-label="delete" onClick={handleOptionDelete(i)}>
                  <Delete />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Box>
      ))}

      {multiple ? (
        <Tooltip title={formatMessage({ id: "form.tips.create" })}>
          <IconButton size="large" aria-label="add" onClick={handleOptionAdd()}>
            <Add fontSize="large" color="primary" />
          </IconButton>
        </Tooltip>
      ) : null}
    </Box>
  );
};
