import { FC, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useIntl } from "react-intl";
import { Box, FormHelperText } from "@mui/material";

import { EthInput } from "@gemunion/mui-inputs-mask";

export interface ITokenInputProps {
  name?: string;
  readOnly?: boolean;
  symbol?: string;
  decimals?: number;
  getCurrentBalance?: (decimals: number) => Promise<string>;
}

export const AmountInput: FC<ITokenInputProps> = props => {
  const { name = "amount", getCurrentBalance, symbol, decimals, readOnly } = props;

  const { formatMessage } = useIntl();

  const [maxValue, setMaxValue] = useState<string | null>(null);
  const contractId = useWatch({ name: "contractId" });

  useEffect(() => {
    if (!getCurrentBalance || !contractId || decimals === undefined) {
      return;
    }

    void getCurrentBalance(decimals).then((balance: string) => {
      setMaxValue(balance);
    });
  }, [contractId, getCurrentBalance, decimals]);

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
