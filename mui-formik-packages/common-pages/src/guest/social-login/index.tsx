import { FC, useEffect } from "react";
import { useSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid } from "@mui/material";
import { Facebook, Google } from "@mui/icons-material";

import { PasswordInput, TextInput } from "@gemunion/mui-inputs-core";
import { ButtonToolbar, PageHeader } from "@gemunion/mui-page-layout";
import { FormikForm } from "@gemunion/mui-form";
import { ApiError, useApi } from "@gemunion/provider-api";
import { ILoginDto, IUser, useUser } from "@gemunion/provider-user";
import { openUrlOnClick } from "@gemunion/popup";
import { useDidMountEffect } from "@gemunion/react-hooks";

import { validationSchema } from "./validation";
import { useStyles } from "./styles";
import { LoginButtons } from "./buttons";

export const SocialLogin: FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const user = useUser<IUser>();
  const api = useApi();

  const handleSubmit = (values: ILoginDto): Promise<IUser | void> => {
    return user.logIn(values, "/dashboard").catch((e: ApiError) => {
      api.setToken(null);
      if (e.status) {
        enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
      } else {
        console.error(e);
        enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
      }
    });
  };

  const onMessage = (event: MessageEvent): void => {
    if (event.origin === process.env.BE_URL) {
      api.setToken(event.data);
      void user.getProfile("/dashboard");
    }
  };

  useDidMountEffect(() => {
    void user.getProfile("/dashboard");
  }, [user.isAuthenticated()]);

  useEffect(() => {
    window.addEventListener("message", onMessage, false);

    return (): void => {
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <Grid container className={classes.section}>
      <Grid item sm={12}>
        <PageHeader message="pages.guest.login" />

        <FormikForm
          showButtons={false}
          showPrompt={false}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
          initialValues={{
            password: "",
            email: "",
          }}
        >
          <TextInput name="email" autoComplete="username" />
          <PasswordInput name="password" autoComplete="current-password" />
          <LoginButtons />
        </FormikForm>
        <ButtonToolbar justifyContent="center">
          <Button
            variant="outlined"
            startIcon={<Google />}
            type="button"
            onClick={openUrlOnClick(`${process.env.BE_URL}/auth/google`)}
            data-testid="loginWithGoogleButton"
          >
            <FormattedMessage id="form.buttons.google" />
          </Button>
          <Button
            variant="outlined"
            startIcon={<Facebook />}
            type="button"
            onClick={openUrlOnClick(`${process.env.BE_URL}/auth/facebook`)}
            data-testid="loginWithFacebookButton"
          >
            <FormattedMessage id="form.buttons.facebook" />
          </Button>
        </ButtonToolbar>
      </Grid>
    </Grid>
  );
};
