import { FC, createElement, ChangeEvent } from "react";
import clsx from "clsx";
import { FormattedMessage } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";
import { InputLabel } from "@mui/material";
import { Rating, RatingProps } from "@mui/lab";
import { Star, SvgIconComponent } from "@mui/icons-material";
import { useStyles } from "./styles";

export interface IRatingInputProps extends RatingProps {
  name: string;
  icon?: SvgIconComponent;
  color?: "inherit" | "disabled" | "error" | "primary" | "secondary" | "action";
}

export const RatingInput: FC<IRatingInputProps> = props => {
  const { name, icon = Star, color, ...rest } = props;
  const classes = useStyles();

  const suffix = name.split(".").pop() as string;

  const form = useFormContext<any>();

  return (
    <div className={clsx(classes.root)}>
      <InputLabel filled shrink>
        <FormattedMessage id={`form.labels.${suffix}`} />
      </InputLabel>
      <Controller
        name={name}
        control={form.control}
        render={({ field }) => (
          <Rating
            {...field}
            max={10}
            icon={createElement(icon, { fontSize: "inherit", color })}
            onChange={(_event: ChangeEvent<unknown>, value): void => {
              form.setValue(name, value);
            }}
            {...rest}
          />
        )}
      />
    </div>
  );
};
