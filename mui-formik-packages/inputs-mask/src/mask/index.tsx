import { FC, useRef } from "react";
import { TextFieldProps } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { TextInput } from "@gemunion/mui-inputs-core";

import { MaskedInputWrapper } from "./wrapper";

export interface IMaskedInputProps {
  name: string;
  readOnly?: boolean;
  disabled?: boolean;
  mask: any;
  unmask?: boolean | "typed";
  dispatch?: (appended: string, dynamicMasked: any) => any;
  onBlur?: (event: Event) => void;
  onChange?: (event: Event) => void;
  onSearch?: (values: any) => void;
  onFocus?: (event: Event) => void;
  definitions?: any;
  maskedRef?: any;
  blocks?: any;
  lazy?: boolean;
  value?: any;
  useMaskedValue?: boolean;
  updateValue?: (ref: any) => void;
  prepare?: (value: string, masked: any) => string;
  commit?: (value: string, masked: any) => void;
}

export const MaskedInput: FC<IMaskedInputProps & TextFieldProps> = props => {
  const {
    name,
    mask,
    unmask,
    readOnly,
    dispatch,
    definitions,
    blocks,
    lazy,
    commit,
    prepare,
    InputLabelProps,
    inputProps,
    updateValue,
    useMaskedValue = true,
    value,
    ...rest
  } = props;

  const maskedRef = useRef<HTMLInputElement & { unmaskedValue?: any }>(null);
  const form = useFormContext<any>();
  const defaultValue = form.getValues(name);

  const handleOnBlur = (): void => {
    if (maskedRef && maskedRef.current) {
      const val = useMaskedValue ? maskedRef.current.value : maskedRef.current.unmaskedValue;
      form.setValue(name, val);
    }
  };

  return (
    <TextInput
      name={name}
      value={value || defaultValue}
      onFocus={() => {}}
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true,
      }}
      maskedRef={maskedRef}
      updateValue={updateValue}
      InputProps={{
        readOnly,
        inputComponent: MaskedInputWrapper,
        inputProps: {
          mask,
          unmask,
          definitions,
          blocks,
          lazy,
          prepare,
          commit,
          maskedRef,
          onBlur: handleOnBlur,
          ...(dispatch ? { dispatch } : {}),
          ...inputProps,
        },
      }}
      {...rest}
    />
  );
};
