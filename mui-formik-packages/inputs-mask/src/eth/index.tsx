import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { utils, constants } from "ethers";

import { MaskedInput } from "../mask";

export interface IEthInputProps {
  allowNegative?: boolean;
  fractionalDelimiter?: string;
  fillByZeros?: boolean;
  name: string;
  readOnly?: boolean;
  precision?: number;
  symbol?: string;
  thousandsSeparator?: string;
}

export const EthInput: FC<IEthInputProps> = props => {
  const {
    allowNegative = false,
    fractionalDelimiter = ".",
    fillByZeros = false,
    name,
    symbol = constants.EtherSymbol,
    thousandsSeparator = " ",
    ...rest
  } = props;

  const formatValue = (value: string): string => {
    return value ? utils.parseEther(value).toString() : "0";
  };

  const normalizeValue = (value: string): string => {
    // values passed from query string are parsed to number by custom qs.decoder
    const normalizedValue = value ? utils.formatEther(value.toString()) : "0";
    const [whole, decimals] = normalizedValue.split(".");

    return decimals === "0" ? whole : normalizedValue;
  };

  const form = useFormContext<any>();
  const value = form.getValues(name);

  const formattedValue = normalizeValue(value);

  return (
    <MaskedInput
      allowNegative={allowNegative}
      decimalSeparator={fractionalDelimiter}
      thousandSeparator={thousandsSeparator}
      allowLeadingZeros={fillByZeros}
      prefix={`${symbol} `}
      name={name}
      formatValue={formatValue}
      defaultValue={formattedValue}
      {...rest}
    />
  );
};
