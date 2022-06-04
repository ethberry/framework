import { FC, forwardRef } from "react";
import { InputBaseComponentProps } from "@mui/material";
import { useWatch } from "react-hook-form";
import clsx from "clsx";

import { ITextInputProps, TextInput } from "../text";
import { useStyles } from "./styles";

export type IStaticInputProps = ITextInputProps;

export const StaticInputComponent = forwardRef<any, InputBaseComponentProps>((props, ref) => {
  const { value, placeholder, className } = props;
  const classes = useStyles();
  return (
    <div className={clsx(className, classes.root)} ref={ref}>
      {value || placeholder}
    </div>
  );
});

export const StaticInput: FC<IStaticInputProps> = props => {
  const { InputLabelProps, InputProps, name, ...rest } = props;

  const value = useWatch({ name });

  return (
    <TextInput
      name={name}
      value={value}
      InputLabelProps={{
        ...InputLabelProps,
        shrink: true,
      }}
      InputProps={{
        ...InputProps,
        inputComponent: StaticInputComponent,
      }}
      {...rest}
    />
  );
};
