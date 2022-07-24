import { FC, useEffect, useState } from "react";
import { FormattedMessage } from "react-intl";
import { Button } from "@mui/material";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { v4 } from "uuid";

import { useMetamask } from "@gemunion/react-hooks-eth";
import { phrase } from "@gemunion/constants";
import { useUser } from "@gemunion/provider-user";
import { IMetamaskDto } from "@gemunion/types-jwt";
import { useApiCall } from "@gemunion/react-hooks";
import { IUser } from "@framework/types";

export const AttachWalletButton: FC = () => {
  const [data, setData] = useState<IMetamaskDto>({ nonce: "", signature: "", wallet: "" });

  const { account } = useWeb3React();

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
        });
    },
    { success: false },
  );

  const metaAttachFn = useMetamask((web3Context: Web3ContextType) => {
    return web3Context.provider
      ?.getSigner()
      .signMessage(`${phrase}${data.nonce}`)
      .then((signature: string) => {
        setData({ ...data, wallet: web3Context.account!, signature });
        return attachCall.fn(void 0, { ...data, wallet: web3Context.account!, signature });
      }) as Promise<void>;
  });

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
      <FormattedMessage id="pages.my-wallet.detach" />
    </Button>
  ) : (
    <Button onClick={handleAttach}>
      <FormattedMessage id="pages.my-wallet.attach" />
    </Button>
  );
};
