import { FC, useMemo } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { FormattedMessage, useIntl } from "react-intl";
import { Box, IconButton, Paper, Tooltip, Typography } from "@mui/material";
import { Add, Delete } from "@mui/icons-material";

import { IAssetComponent, ModuleType, TokenType } from "@framework/types";

import { emptyItem, emptyPrice } from "./empty-price";
import { TokenTypeInput } from "./token-type-input";
import { ContractInput } from "./contract-input";
import { TemplateInput } from "./template-input";
import { AmountInput } from "./amount-input";

type TAssetComponentParams = IAssetComponent & {
  id: string;
};

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

  const { fields, append, remove } = useFieldArray({ name: nestedPrefix, control: form.control });
  const watchFields = useWatch({ name: nestedPrefix });
  const values: TAssetComponentParams[] = fields.map(
    (field, index) =>
      ({
        ...field,
        ...watchFields[index],
      } as TAssetComponentParams),
  );

  const handleOptionAdd = (): (() => void) => (): void => {
    append((ancestorPrefix === "price" ? emptyPrice : emptyItem).components[0]);
  };

  const handleOptionDelete =
    (i: number): (() => void) =>
    (): void => {
      remove(i);
    };

  return useMemo(
    () => (
      <Box mt={2}>
        <Typography>
          <FormattedMessage id={`form.labels.${ancestorPrefix}`} />
        </Typography>

        {values?.map((o: TAssetComponentParams, i: number) => (
          <Box key={o.id} mt={1} mb={1} display="flex" justifyContent="space-between" alignItems="center">
            <Box flex={1}>
              <Paper sx={{ p: 2 }}>
                <TokenTypeInput
                  prefix={`${nestedPrefix}[${i}]`}
                  disabledOptions={disabledTokenTypes}
                  readOnly={readOnly}
                />
                <ContractInput prefix={`${nestedPrefix}[${i}]`} contractModule={contractModule} readOnly={readOnly} />
                <TemplateInput prefix={`${nestedPrefix}[${i}]`} readOnly={readOnly} />
                <AmountInput prefix={`${nestedPrefix}[${i}]`} readOnly={readOnly} />
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
    ),
    [disabledTokenTypes, readOnly, values],
  );
};
