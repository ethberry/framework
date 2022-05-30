import { FC, useEffect } from "react";
import { Grid } from "@mui/material";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { Captcha } from "@gemunion/mui-inputs-captcha";
import { PageHeader } from "@gemunion/mui-page-layout";
import { FormikForm } from "@gemunion/mui-form";
import { TextInput } from "@gemunion/mui-inputs-core";
import { useUser } from "@gemunion/provider-user";
import { ApiError, useApi } from "@gemunion/provider-api";

import { validationSchema } from "./validation";
import { useStyles } from "./styles";

interface IForgotPasswordDto {
  email: string;
  captcha: string;
}

export const ForgotPassword: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const user = useUser();
  const api = useApi();

  const handleSubmit = (values: IForgotPasswordDto, formikBag: any): Promise<void> => {
    return api
      .fetchJson({
        url: "/auth/forgot-password",
        method: "POST",
        data: values,
      })
      .then(() => {
        navigate("/message/forgot-successful");
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          const errors = e.getLocalizedValidationErrors();

          Object.keys(errors).forEach(key => {
            formikBag.setError(key, { type: "custom", message: errors[key] });
          });
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  useEffect(() => {
    if (user.isAuthenticated()) {
      void user.getProfile("/profile");
    }
  }, [user.isAuthenticated()]);

  return (
    <Grid container className={classes.section}>
      <Grid item sm={10}>
        <PageHeader message="pages.guest.forgotPassword" />
        <FormikForm
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          initialValues={{
            email: "",
            captcha: "",
          }}
        >
          <TextInput name="email" autoComplete="username" />
          <Captcha />
        </FormikForm>
      </Grid>
    </Grid>
  );
};
