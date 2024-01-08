import { FC, useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { FormattedMessage, useIntl } from "react-intl";
import { Button, Grid } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { v4 } from "uuid";

import { phrase } from "@gemunion/constants";
import { IMetamaskDto } from "@gemunion/types-jwt";
import { PageHeader } from "@gemunion/mui-page-layout";
import { ApiError, IJwt, useApi } from "@gemunion/provider-api";
import { useLicense } from "@gemunion/provider-license";
import { IUser, useUser } from "@gemunion/provider-user";
import { useWallet } from "@gemunion/provider-wallet";

export const MetamaskLogin: FC = () => {
  const license = useLicense();

  const { formatMessage } = useIntl();
  const [data, setData] = useState<IMetamaskDto>({ nonce: "", signature: "", wallet: "" });

  const { account, provider, isActive } = useWeb3React();
  const { openConnectWalletDialog } = useWallet();

  const user = useUser<IUser>();
  const api = useApi();

  const handleSubmit = (values: IMetamaskDto): Promise<IUser | void> => {
    return api
      .fetchJson({
        url: "/auth/metamask",
        method: "POST",
        data: values,
      })
      .then((json: IJwt) => {
        api.setToken(json);
        return user.getProfile("/dashboard");
      })
      .catch((e: ApiError) => {
        api.setToken(null);
        if (e.status) {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        } else {
          console.error(e);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  const handleConnect = (): void => {
    void openConnectWalletDialog();
  };

  const handleLogin = (): Promise<any> | undefined => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return provider
      ?.getSigner()
      .signMessage(`${phrase}${data.nonce}`)
      .then((signature: string) => {
        setData({ ...data, signature });
        return handleSubmit({ ...data, signature });
      })
      .catch((error: any) => {
        if (error.code === 4001) {
          enqueueSnackbar(formatMessage({ id: "snackbar.rejectedByUser" }), { variant: "warning" });
        } else {
          console.error(error);
          enqueueSnackbar(formatMessage({ id: "snackbar.error" }), { variant: "error" });
        }
      });
  };

  useEffect(() => {
    if (user.isAuthenticated()) {
      void user.getProfile("/dashboard");
    }
  }, [user.isAuthenticated()]);

  useEffect(() => {
    setData({ nonce: v4(), signature: "", wallet: account || "" });
  }, [account]);

  if (!license.isValid()) {
    return null;
  }

  return (
    <Grid
      container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 64px)",
        maxWidth: 500,
        margin: "0 auto",
      }}
    >
      <Grid item sm={12}>
        <PageHeader message="pages.guest.login" />
        {isActive ? (
          <Button onClick={handleLogin}>
            <FormattedMessage id="form.buttons.login" />
          </Button>
        ) : (
          <Button onClick={handleConnect}>
            <FormattedMessage id="components.header.wallet.connect" />
          </Button>
        )}
      </Grid>
    </Grid>
  );
};

export const Login = MetamaskLogin;
