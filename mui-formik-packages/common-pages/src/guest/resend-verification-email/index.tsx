import { FC } from "react";
import { useNavigate } from "react-router";
import { useSnackbar } from "notistack";
import { Grid } from "@mui/material";
import { useIntl } from "react-intl";

import { Captcha } from "@gemunion/mui-inputs-captcha";
import { PageHeader } from "@gemunion/mui-page-layout";
import { TextInput } from "@gemunion/mui-inputs-core";
import { FormikForm } from "@gemunion/mui-form";
import { ApiError, useApi } from "@gemunion/provider-api";

import { useStyles } from "./styles";
import { validationSchema } from "./validation";

interface IResendVerificationEmailDto {
  email: string;
  captcha: string;
}

export const ResendVerificationEmail: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const api = useApi();

  const handleSubmit = (values: IResendVerificationEmailDto, formikBag: any): Promise<void> => {
    return api
      .fetchJson({
        url: "/auth/resend-email-verification",
        method: "POST",
        data: values,
      })
      .then(() => {
        navigate("/message/resend-successful");
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

  return (
    <Grid container className={classes.section}>
      <Grid item sm={10}>
        <PageHeader message="pages.guest.resendVerificationEmail" />

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
