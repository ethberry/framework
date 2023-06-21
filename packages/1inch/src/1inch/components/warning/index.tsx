import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { IUser } from "@framework/types";
import { useUser } from "@gemunion/provider-user";
import { chainIdToNetwork } from "@gemunion/provider-wallet";

export const Warning: FC = () => {
  const { chainId } = useWeb3React();
  const { profile } = useUser<IUser>();

  if (!profile || !chainId || chainId === profile.chainId) {
    return null;
  }

  return (
    <Alert
      severity="warning"
      sx={{
        mb: 2,
        mx: "auto",
        width: 600,
        position: "absolute",
        left: 0,
        right: 0,
        top: -80,
      }}
    >
      <FormattedMessage
        id="pages.dex.1inch.warning.text"
        values={{
          walletNetwork: chainIdToNetwork[chainId] || `#${chainId}`,
          appNetwork: chainIdToNetwork[profile.chainId],
        }}
      />
    </Alert>
  );
};
