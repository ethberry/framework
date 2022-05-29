import { FC } from "react";
// eslint-disable-next-line import/no-named-as-default
import ReCAPTCHA from "react-google-recaptcha";
import { FormattedMessage } from "react-intl";
import { Controller, useFormContext } from "react-hook-form";
import { Grid, FormHelperText } from "@mui/material";

import { useStyles } from "./styles";

interface ICaptchaProps {
  name?: string;
}

export const Captcha: FC<ICaptchaProps> = props => {
  const { name = "captcha" } = props;

  const form = useFormContext<any>();
  const error = form.formState.errors[name];
  const classes = useStyles();

  return (
    <Controller
      name={name}
      control={form.control}
      render={({ field }) => (
        <Grid className={classes.root}>
          <ReCAPTCHA
            sitekey={process.env.GOOGLE_RECAPTCHA_PUBLIC}
            {...field}
            onChange={(value: string | null): void => {
              form.setValue(name, value);
            }}
          />
          {error && error.message ? (
            <FormHelperText error>
              <FormattedMessage id={error.message} />
            </FormHelperText>
          ) : null}
        </Grid>
      )}
    />
  );
};
