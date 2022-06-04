import { FC, ReactElement } from "react";
import { useIntl } from "react-intl";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { FormControlLabel, Slider, SliderProps } from "@mui/material";

import { useStyles } from "./styles";

export interface ISliderInputProps extends SliderProps {
  name: string;
  label?: string | number | ReactElement;
}

export const SliderInput: FC<ISliderInputProps> = props => {
  const { name, label, ...rest } = props;
  const classes = useStyles();

  const suffix = name.split(".").pop() as string;

  const form = useFormContext<any>();
  const value = useWatch({ name });

  const { formatMessage } = useIntl();
  const localizedLabel = label === void 0 ? formatMessage({ id: `form.labels.${suffix}` }) : label;

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <FormControlLabel
          labelPlacement="start"
          classes={{ root: classes.label }}
          control={
            <Slider
              {...field}
              name={name}
              value={value}
              classes={{ root: classes.slider }}
              onChange={(_event, value): void => {
                form.setValue(name, value, { shouldTouch: true });
              }}
              {...rest}
            />
          }
          label={localizedLabel}
        />
      )}
    />
  );
};
