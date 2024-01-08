import { FC, useEffect, useState } from "react";
import { useWeb3React, Web3ContextType } from "@web3-react/core";
import { FormattedMessage } from "react-intl";
import { AuthType } from "@particle-network/auth";
import { v4 } from "uuid";

import { phrase } from "@gemunion/constants";
import { ProgressOverlay } from "@gemunion/mui-page-layout";
import { useUser } from "@gemunion/provider-user";
import { getParticleButtonIcon, useConnectParticle } from "@gemunion/provider-wallet";
import { useApiCall } from "@gemunion/react-hooks";
import { useMetamask } from "@gemunion/react-hooks-eth";
import type { IMetamaskDto, IWalletLoginButtonProps } from "@gemunion/types-jwt";

import { StyledButton } from "./styled";

export const ParticleLoginButton: FC<IWalletLoginButtonProps & { type: AuthType }> = props => {
  const { onWalletVerified, type } = props;
  const [data, setData] = useState<IMetamaskDto>({ nonce: v4(), signature: "", wallet: "" });

  const { account } = useWeb3React();

  const user = useUser<any>();

  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const { fn: getVerifiedToken, isLoading } = useApiCall(
    (api, values: IMetamaskDto) => {
      return api
        .fetchJson({
          url: "/metamask/login",
          method: "POST",
          data: values,
        })
        .catch(error => {
          setIsVerifying(false);
          throw error;
        }) as Promise<{ token: string }>;
    },
    { success: false },
  );

  const handleLogin = useMetamask(
    async (web3Context: Web3ContextType) => {
      try {
        setIsVerifying(true);

        const wallet = web3Context.account!;
        const provider = web3Context.provider!;

        const signature = await provider.getSigner().signMessage(`${phrase}${data.nonce}`);

        setData({ ...data, wallet, signature });

        const token = await getVerifiedToken(void 0, { wallet, nonce: data.nonce, signature });
        await onWalletVerified(token?.token || "");
      } catch (error) {
        console.error(error);
        setIsVerifying(false);
      }
    },
    { success: false },
  );

  const handleClick = useConnectParticle({ onClick: handleLogin });

  const userIsAuthenticated = user.isAuthenticated();

  useEffect(() => {
    if (!userIsAuthenticated) {
      setIsVerifying(false);
    }
  }, [userIsAuthenticated]);

  useEffect(() => {
    setData({ nonce: v4(), signature: "", wallet: account || "" });
  }, [account]);

  return (
    <ProgressOverlay isLoading={isLoading}>
      <StyledButton
        key={type}
        onClick={() => handleClick(type)}
        startIcon={getParticleButtonIcon(type)}
        disabled={isVerifying}
        fullWidth
      >
        <FormattedMessage id={`pages.guest.signInWith.${type}`} />
      </StyledButton>
    </ProgressOverlay>
  );
};

export const ParticleFacebookLoginButton = (props: IWalletLoginButtonProps) => (
  <ParticleLoginButton {...props} type="facebook" />
);

export const ParticleGoogleLoginButton = (props: IWalletLoginButtonProps) => (
  <ParticleLoginButton {...props} type="google" />
);
