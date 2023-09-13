import { FC, useEffect, useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@mui/material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { useSnackbar } from "notistack";
import { v4 } from "uuid";

import type { IMetamaskDto } from "@gemunion/types-jwt";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { phrase } from "@gemunion/constants";
import { useUser } from "@gemunion/provider-user";
import { useApiCall } from "@gemunion/react-hooks";
import { ApiError } from "@gemunion/provider-api-firebase";
import type { IUser } from "@framework/types";

export const AttachWalletButton: FC = () => {
  const [data, setData] = useState<IMetamaskDto>({ nonce: "", signature: "", wallet: "" });

  const { account } = useWeb3React();
  const { enqueueSnackbar } = useSnackbar();
  const { formatMessage } = useIntl();

  const user = useUser<IUser>();

  const attachCall = useApiCall(
    async (api, values) => {
      return api
        .fetchJson({
          url: "/profile/wallet",
          method: "POST",
          data: values,
        })
        .then(() => {
          return user.getProfile();
        })
        .catch((e: ApiError) => {
          enqueueSnackbar(formatMessage({ id: `snackbar.${e.message}` }), { variant: "error" });
        });
    },
    { success: false, error: false },
  );

  const metaAttachFn = useMetamask(
    (web3Context: Web3ContextType) => {
      return web3Context.provider
        ?.getSigner()
        .signMessage(`${phrase}${data.nonce}`)
        .then((signature: string) => {
          setData({ ...data, wallet: web3Context.account!, signature });
          return attachCall.fn(void 0, { ...data, wallet: web3Context.account!, signature });
        }) as Promise<void>;
    },
    { success: false },
  );

  const handleAttach = async () => {
    await metaAttachFn();
  };

  const detachCall = useApiCall(async api => {
    return api.fetchJson({
      url: "/profile/wallet",
      method: "DELETE",
    });
  });

  const handleDetach = () => {
    return detachCall.fn().then(() => {
      return user.getProfile();
    });
  };

  useEffect(() => {
    setData({ nonce: v4(), signature: "", wallet: account || "" });
  }, [account]);

  return user.profile.wallet ? (
    <Button onClick={handleDetach}>
      <FormattedMessage id="pages.wallet.detach" />
    </Button>
  ) : (
    <Button onClick={handleAttach}>
      <FormattedMessage id="pages.wallet.attach" />
    </Button>
  );
};
