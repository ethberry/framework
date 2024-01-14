import { FC, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { Box, Button, Grid } from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { auth } from "firebaseui";
import {
  EmailAuthProvider,
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  sendEmailVerification,
  signInWithCustomToken,
} from "firebase/auth";
import { FormattedMessage, useIntl } from "react-intl";
import { useNavigate } from "react-router";
import { enqueueSnackbar } from "notistack";

import "firebaseui/dist/firebaseui.css";

import firebase from "@gemunion/firebase";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useLicense } from "@gemunion/provider-license";
import { useUser } from "@gemunion/provider-user";
import type { IWalletLoginButtonProps } from "@gemunion/types-jwt";

import { StyledContainer, StyledFirebaseAuthForm } from "./styled";

export enum PROVIDERS {
  email = "email",
  google = "google",
  facebook = "facebook",
  twitter = "twitter",
}

export const providersStore = {
  [PROVIDERS.email]: {
    provider: EmailAuthProvider.PROVIDER_ID,
    requireDisplayName: false,
  },
  [PROVIDERS.google]: GoogleAuthProvider.PROVIDER_ID,
  [PROVIDERS.facebook]: FacebookAuthProvider.PROVIDER_ID,
  [PROVIDERS.twitter]: TwitterAuthProvider.PROVIDER_ID,
};

export interface IFirebaseLogin {
  providers?: PROVIDERS[];
  wallets?: Array<FC<IWalletLoginButtonProps>>;
  withEmail?: boolean;
}

export const FirebaseLogin: FC<IFirebaseLogin> = props => {
  const { providers = [PROVIDERS.email], wallets = [], withEmail = true } = props;
  const { formatMessage } = useIntl();

  const license = useLicense();

  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);

  const user = useUser<any>();
  const navigate = useNavigate();

  const signInOptions = useMemo(() => providers.map(name => providersStore[name]), [providers]);

  const handleMainPageClick = () => {
    navigate("/");
  };

  const authFb = getAuth(firebase);

  const onWalletVerified = async (token: string) => {
    if (!token) {
      return;
    }

    await signInWithCustomToken(authFb, token);

    setIsLoggingIn(true);
    await user.logIn().catch(e => {
      console.error("login error", e);
      setIsLoggingIn(false);
    });
    setIsLoggingIn(false);
  };

  useLayoutEffect(() => {
    const ui = auth.AuthUI.getInstance() || new auth.AuthUI(authFb);
    ui.start("#firebaseui-auth-container", {
      callbacks: {
        signInSuccessWithAuthResult: data => {
          if (data.additionalUserInfo.isNewUser && !data.additionalUserInfo.profile.verified_email) {
            const actionCodeSettings = {
              url: `${window.location.origin}/login`,
            };
            void sendEmailVerification(authFb.currentUser!, actionCodeSettings).then(() => {
              enqueueSnackbar(formatMessage({ id: "snackbar.registered" }), { variant: "info" });
              setShowMessage(true);
            });
          } else {
            setIsLoggingIn(true);
            void user.logIn().catch(() => {
              setIsLoggingIn(false);
            });
          }
          return false;
        },
        signInFailure: error => {
          setIsLoggingIn(false);
          console.error("error", error);
        },
      },
      signInFlow: "popup",
      signInOptions,
    });
    return () => {
      if (auth.AuthUI.getInstance() && ui) {
        void ui.delete();
      }
    };
  }, []);

  useEffect(() => {
    return () => setShowMessage(false);
  }, []);

  if (!license.isValid()) {
    return null;
  }

  return (
    <ProgressOverlay isLoading={isLoggingIn} spinnerSx={{ zIndex: 1000 }}>
      <StyledContainer container>
        <Grid item xs={12}>
          {showMessage && (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
              <FormattedMessage id="pages.guest.confirmation" />
              <Box mt={2}>
                <Button
                  onClick={handleMainPageClick}
                  variant="contained"
                  color="primary"
                  data-testid="LoginMainPageButton"
                  endIcon={<NavigateNext />}
                >
                  <FormattedMessage id="form.buttons.mainPage" />
                </Button>
              </Box>
            </Box>
          )}
          <StyledFirebaseAuthForm withEmail={withEmail} id="firebaseui-auth-container" />
          {wallets.map((Wallet, i) => (
            <Wallet key={i} onWalletVerified={onWalletVerified} />
          ))}
        </Grid>
      </StyledContainer>
    </ProgressOverlay>
  );
};

export const Login = FirebaseLogin;
