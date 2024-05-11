import { FC, PropsWithChildren, useLayoutEffect, useRef, useState } from "react";
import { Web3ContextType, useWeb3React } from "@web3-react/core";
import { getAuth, signInWithCustomToken } from "firebase/auth";
import { v4 } from "uuid";

import type { IUser } from "@framework/types";
import { phrase } from "@gemunion/constants";
import firebase from "@gemunion/firebase";
import { useUser } from "@gemunion/provider-user";
import { useConnectMetamask } from "@gemunion/provider-wallet";
import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import { TConnectors, useAppSelector, collectionActions, useAppDispatch } from "@gemunion/redux";
import type { IMetamaskDto } from "@gemunion/types-jwt";
import { ProgressOverlay } from "@gemunion/mui-page-layout";

export const WalletReLogin: FC<PropsWithChildren> = props => {
  const { children } = props;
  const authFb = getAuth(firebase);
  const user = useUser<IUser>();
  const isUserAuthenticated = user.isAuthenticated();
  const { account = "", isActive } = useWeb3React();
  const { activeConnector } = useAppSelector(state => state.wallet);
  const dispatch = useAppDispatch();
  const { setNeedRefresh } = collectionActions;

  const [didMount, setDidMount] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const currentWallet = useRef<string | null>(null);

  const onWalletVerified = async (token: string) => {
    if (!token) {
      return;
    }
    await signInWithCustomToken(authFb, token);
    await user.logIn(void 0, location.pathname).catch(e => {
      console.error("login error", e);
    });
    await dispatch(setNeedRefresh(true));
  };

  const { fn: getVerifiedToken } = useApiCall(
    (api, values: IMetamaskDto) => {
      return api
        .fetchJson({
          url: "/metamask/login",
          method: "POST",
          data: values,
        })
        .catch(error => {
          throw error;
        }) as Promise<{ token: string }>;
    },
    { success: false },
  );

  const onLoginMetamask = useMetamask(
    async (web3Context: Web3ContextType) => {
      try {
        const provider = web3Context.provider!;
        const nonce = v4();

        const signature = await provider.getSigner().signMessage(`${phrase}${nonce}`);

        const token = await getVerifiedToken(void 0, { wallet: currentWallet.current, nonce, signature });
        await onWalletVerified(token?.token || "");
      } catch (error) {
        console.error(error);
      } finally {
        setIsConnecting(false);
      }
    },
    { success: false },
  );

  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const handleMetamaskLogin = useConnectMetamask({ onClick: onLoginMetamask });

  useLayoutEffect(() => {
    if (
      isConnecting ||
      !didMount ||
      !account ||
      !activeConnector ||
      currentWallet.current === account ||
      !isUserAuthenticated ||
      activeConnector !== TConnectors.METAMASK
    ) {
      return;
    }
    setIsConnecting(true);
    void handleMetamaskLogin();
  }, [account, activeConnector, didMount, isConnecting, isUserAuthenticated]);

  useLayoutEffect(() => {
    if (!isActive) {
      return;
    }
    currentWallet.current = account;
    setDidMount(true);
    return () => {
      setDidMount(false);
    };
  }, [account, isActive, didMount]);

  useLayoutEffect(() => {
    if (!isActive) {
      currentWallet.current = null;
    }
  }, [isActive]);

  return <ProgressOverlay isLoading={isConnecting}>{children}</ProgressOverlay>;
};
