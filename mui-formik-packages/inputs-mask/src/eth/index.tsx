import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { utils, constants } from "ethers";

import { MaskedInput } from "../mask";

export interface IEthInputProps {
  allowNegative?: boolean;
  fractionalDelimiter?: string;
  fillByZeros?: string;
  name: string;
  readOnly?: boolean;
  precision?: number;
  symbol?: string;
  thousandsSeparator?: string;
  onSearch?: (values: any) => void;
}

export const EthInput: FC<IEthInputProps> = props => {
  const {
    allowNegative = false,
    fractionalDelimiter = ".",
    fillByZeros = false,
    name,
    precision = 2,
    symbol = constants.EtherSymbol,
    thousandsSeparator = " ",
    onSearch,
    ...rest
  } = props;

  const formatValue = (value: string): string => {
    return value ? utils.parseEther(value).toString() : "0";
  };

  const normalizeValue = (value: string): string => {
    // values passed from query string are parsed to number by custom qs.decoder
    const normalizedValue = value ? utils.formatEther(value.replace(symbol, "").trim().toString()) : "0";
    const [whole, decimals] = normalizedValue.split(".");

    return decimals === "0" ? whole : normalizedValue;
  };

  const form = useFormContext<any>();
  const value = form.getValues(name);

  const formattedValue = normalizeValue(value);

  const maskProps = {
    mask: Number,
    thousandsSeparator,
    scale: precision, // digits after decimal
    signed: allowNegative, // allow negative
    normalizeZeros: true, // appends or removes zeros at ends
    radix: fractionalDelimiter, // fractional delimiter
    padFractionalZeros: fillByZeros, // if true, then pads zeros at end to the length of scale
  };

  const mask = [
    {
      mask: "", // To hide symbol if field is empty
    },
    {
      mask: `${symbol} num`,
      blocks: {
        num: maskProps,
      },
    },
  ];

  const updateValue = (maskedRef: any): void => {
    if (maskedRef && maskedRef.current) {
      const currencyAmount = formatValue(maskedRef.current.unmaskedValue);
      form.setValue(name, currencyAmount);
    }
  };

  return (
    <MaskedInput
      mask={mask}
      name={name}
      updateValue={updateValue}
      useMaskedValue={false}
      value={formattedValue}
      onSearch={onSearch}
      {...rest}
    />
  );
};
