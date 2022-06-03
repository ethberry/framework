import { FC } from "react";
import { useFormContext } from "react-hook-form";

import { MaskedInput } from "../mask";

export interface ICurrencyInputProps {
  allowNegative?: boolean;
  fractionalDelimiter?: string;
  fillByZeros?: boolean;
  name: string;
  readOnly?: boolean;
  precision?: number;
  symbol?: string;
  thousandsSeparator?: string;
}

export const CurrencyInput: FC<ICurrencyInputProps> = props => {
  const {
    allowNegative = false,
    fractionalDelimiter = ".",
    fillByZeros = false,
    name,
    precision = 2,
    symbol = "$",
    thousandsSeparator = " ",
    ...rest
  } = props;

  const formatValue = (value: string): number => Number.parseFloat(value) * 10 ** precision;
  const normalizeValue = (value: number): string => (value ? (value / 10 ** precision).toString() : "0");

  const form = useFormContext<any>();
  const value = form.getValues(name);
  const formattedValue = normalizeValue(value);

  const handleOnChange = ({ target }: any): void => {
    form.setValue(target.name, target.value);
  };

  return (
    <MaskedInput
      allowNegative={allowNegative}
      decimalSeparator={fractionalDelimiter}
      thousandSeparator={thousandsSeparator}
      allowLeadingZeros={fillByZeros}
      prefix={`${symbol} `}
      name={name}
      formatValue={formatValue}
      value={formattedValue}
      onChange={handleOnChange}
      {...rest}
    />
  );
};
