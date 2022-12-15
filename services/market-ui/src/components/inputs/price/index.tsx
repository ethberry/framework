import { FC, useEffect } from "react";
import { get, useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { ModuleType, TokenType } from "@framework/types";

import { emptyItems, emptyPrice, ITokenAssetComponent } from "./empty-price";
import { TokenTypeInput } from "./token-type-input";
import { ContractInput } from "./contract-input";
import { TokenInput } from "./token-input";
import { AmountInput } from "./amount-input";

export interface IPriceEditDialogProps {
  prefix: string;
  multiple?: boolean;
  readOnly?: boolean;
  disabledTokenTypes?: Array<TokenType>;
  contractModule?: Array<ModuleType>;
}

export const PriceInput: FC<IPriceEditDialogProps> = props => {
  const { prefix = "price", multiple = false, disabledTokenTypes, contractModule, readOnly } = props;

  const { formatMessage } = useIntl();
  const form = useFormContext<any>();
  const ancestorPrefix = prefix.split(".").pop() as string;
  const nestedPrefix = `${prefix}.components`;

  const values = get(useWatch(), nestedPrefix);

  const handleOptionAdd = (): (() => void) => (): void => {
    const newValue = get(form.getValues(), nestedPrefix);
    newValue.push((ancestorPrefix === "price" ? emptyPrice : emptyItems).components[0]);
    form.setValue(nestedPrefix, newValue);
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      const newValue = get(form.getValues(), nestedPrefix);
      newValue.splice(i, 1);
      form.setValue(nestedPrefix, newValue);
    };

  useEffect(() => {
    if (!values) {
      return;
    }
    values.forEach((value: ITokenAssetComponent, i: number) => {
      form.setValue(`${nestedPrefix}[${i}].decimals`, value.contract?.decimals);
      form.setValue(`${nestedPrefix}[${i}].address`, value.contract?.address);
    });
  }, [values]);

  return (
    <Box mt={2}>
      <Typography>
        <FormattedMessage id={`form.labels.${ancestorPrefix}`} />
      </Typography>

      {values?.map((o: ITokenAssetComponent, i: number) => (
        <Box
          key={`${o.contractId}_${o.templateId}_${i}`}
          mt={1}
          mb={1}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box flex={1}>
            <Paper sx={{ p: 2 }}>
              <TokenTypeInput
                prefix={`${nestedPrefix}[${i}]`}
                disabledOptions={disabledTokenTypes}
                readOnly={readOnly}
              />
              <ContractInput prefix={`${nestedPrefix}[${i}]`} contractModule={contractModule} readOnly={readOnly} />
              <TokenInput prefix={`${nestedPrefix}[${i}]`} readOnly={readOnly} />
              <AmountInput prefix={`${nestedPrefix}[${i}]`} readOnly={readOnly} />
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
