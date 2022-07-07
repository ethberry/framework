import { FC } from "react";
import { get, useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { IAssetComponent, TokenType } from "@framework/types";

import { emptyPrice } from "../empty-price";
import { TokenTypeInput } from "./token-type-input";
import { ContractInput } from "./contract-input";
import { TokenInput } from "./token-input";
import { AmountInput } from "./amount-input";

export interface IStakingEditDialogProps {
  prefix: string;
  multiple?: boolean;
  disabledOptions?: Array<TokenType>;
}

export const PriceInput: FC<IStakingEditDialogProps> = props => {
  const { prefix, multiple = false, disabledOptions } = props;

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

      {value?.map((o: IAssetComponent, i: number) => (
        <Box
          key={`${o.contractId}_${o.tokenId}_${i}`}
          mt={1}
          mb={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flex={1}>
            <Paper sx={{ p: 2 }}>
              <TokenTypeInput prefix={`${nestedPrefix}[${i}]`} disabledOptions={disabledOptions} />
              <ContractInput prefix={`${nestedPrefix}[${i}]`} />
              <TokenInput prefix={`${nestedPrefix}[${i}]`} />
              <AmountInput prefix={`${nestedPrefix}[${i}]`} />
            </Paper>
          </Box>

          <Box ml={2}>
            {multiple && (
              <Tooltip title={formatMessage({ id: "form.tips.delete" })}>
                <IconButton aria-label="delete" onClick={handleOptionDelete(i)} disabled={!i}>
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
