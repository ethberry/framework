import { FC } from "react";
import { useNavigate, useParams } from "react-router";
import { Grid } from "@mui/material";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";

import { PasswordInput } from "@gemunion/mui-inputs-core";
import { PageHeader } from "@gemunion/mui-page-layout";
import { FormikForm } from "@gemunion/mui-form";
import { ApiError, useApi } from "@gemunion/provider-api";

import { validationSchema } from "./validation";
import { useStyles } from "./styles";

interface IRestorePasswordDto {
  password: string;
  confirm: string;
  token: string;
}

export const RestorePassword: FC = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const { token } = useParams<{ token: string }>();
  const { formatMessage } = useIntl();
  const { enqueueSnackbar } = useSnackbar();

  const api = useApi();

  const handleSubmit = (values: IRestorePasswordDto, formikBag: any): Promise<void> => {
    return api
      .fetchJson({
        url: "/auth/restore-password",
        method: "POST",
        data: values,
      })
      .then(() => {
        enqueueSnackbar(formatMessage({ id: "snackbar.passwordChanged" }), { variant: "success" });
        navigate("/login");
      })
      .catch((e: ApiError) => {
        if (e.status === 400) {
          const errors = e.getLocalizedValidationErrors();

          Object.keys(errors).forEach(key => {
            formikBag.setError(key, { type: "custom", message: errors[key] });
          });
        } else if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
          navigate("/forgot-password");
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  return (
    <Grid className={classes.section}>
      <PageHeader message="pages.guest.restorePassword" />
      <FormikForm
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        initialValues={{
          password: "",
          confirm: "",
          token,
        }}
      >
        <PasswordInput name="password" autoComplete="new-password" />
        <PasswordInput name="confirm" autoComplete="new-password" />
      </FormikForm>
    </Grid>
  );
};
