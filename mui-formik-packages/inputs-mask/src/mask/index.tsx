import { FC } from "react";

import { MaskedInputWrapper } from "./wrapper";

export interface IMaskedInputProps {
  name: string;
  readOnly?: boolean;
  disabled?: boolean;
  thousandSeparator?: string;
  isNumericString?: boolean;
  prefix?: string;
  decimalSeparator?: string;
  allowNegative?: boolean;
  allowLeadingZeros?: boolean;
  displayType?: "input" | "text";
  type?: "text" | "tel" | "password";
  format?: string;
  mask?: string;
  onBlur?: (event: Event) => void;
  onChange?: (event: { target: { name: string; value: string } }) => void;
  onFocus?: (event: Event) => void;
  formatValue?: (value: string) => string | number;
  value?: any;
  defaultValue?: any;
  variant?: "standard" | "filled" | "outlined";
}

export const MaskedInput: FC<IMaskedInputProps> = props => {
  const {
    name,
    mask,
    prefix,
    thousandSeparator,
    isNumericString,
    decimalSeparator,
    allowNegative,
    allowLeadingZeros,
    displayType,
    type,
    format,
    formatValue,
    defaultValue,
    ...rest
  } = props;

  return (
    <MaskedInputWrapper
      name={name}
      defaultValue={defaultValue}
      mask={mask}
      prefix={prefix}
      thousandSeparator={thousandSeparator}
      isNumericString={isNumericString}
      decimalSeparator={decimalSeparator}
      allowNegative={allowNegative}
      allowLeadingZeros={allowLeadingZeros}
      displayType={displayType}
      type={type}
      format={format}
      formatValue={formatValue}
      {...rest}
    />
  );
};
