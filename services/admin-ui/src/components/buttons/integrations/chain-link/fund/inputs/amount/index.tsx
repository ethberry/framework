import { FC, useEffect, useMemo, useState } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Box, FormHelperText } from "@mui/material";

import { EthInput } from "@gemunion/mui-inputs-mask";

export interface ITokenInputProps {
  name?: string;
  readOnly?: boolean;
  symbol?: string;
  getMaxBalance?: (decimals: number) => Promise<string>;
}

export const AmountInput: FC<ITokenInputProps> = props => {
  const { name = "amount", getMaxBalance, symbol, readOnly } = props;

  const { formatMessage } = useIntl();

  const [maxValue, setMaxValue] = useState<string | null>(null);
  const form = useFormContext();
  const contractId = useWatch({ name: "contractId" });
  const decimals = useWatch({ name: "contract.decimals" });

  useEffect(() => {
    if (!getMaxBalance || !contractId || decimals === undefined) {
      return;
    }

    void getMaxBalance(decimals).then((balance: string) => {
      const value = Number(balance) === 0 ? balance : Number(balance).toFixed(4);
      form.setValue(name, value);
      setMaxValue(value);
    });
  }, [contractId, getMaxBalance, decimals]);

  const label = formatMessage({ id: `form.labels.${name}` });
  const helperAmountText = useMemo(
    () => formatMessage({ id: "form.hints.maxValue" }, { label, value: maxValue }),
    [maxValue],
  );

  return (
    <Box sx={{ position: "relative" }}>
      <Box sx={{ display: "flex", justifyContent: "flex-end", position: "absolute", top: 4, right: 0 }}>
        {maxValue ? <FormHelperText>{helperAmountText}</FormHelperText> : null}
      </Box>
      <EthInput name={name} units={decimals} symbol={symbol} readOnly={readOnly} />
    </Box>
  );
};
