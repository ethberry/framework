import { FC, useEffect } from "react";
import { useSnackbar } from "notistack";
import { useIntl } from "react-intl";
import { Grid } from "@mui/material";

import { PasswordInput, TextInput } from "@gemunion/mui-inputs-core";
import { PageHeader } from "@gemunion/mui-page-layout";
import { FormWrapper } from "@gemunion/mui-form";
import { ApiError, useApi } from "@gemunion/provider-api";
import { ILoginDto, IUser, useUser } from "@gemunion/provider-user";
import { useDidMountEffect } from "@gemunion/react-hooks";

import { validationSchema } from "./validation";
import { useStyles } from "./styles";
import { LoginButtons } from "./buttons";

export const SystemLogin: FC = () => {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const user = useUser<IUser>();
  const api = useApi();

  const handleSubmit = (values: ILoginDto): Promise<IUser | void> => {
    return user.logIn(values, "/").catch((e: ApiError) => {
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

        <FormWrapper
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
        </FormWrapper>
      </Grid>
    </Grid>
  );
};

export const Login = SystemLogin;
