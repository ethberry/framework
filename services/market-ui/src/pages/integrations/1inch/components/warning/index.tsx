import { FC } from "react";
import { FormattedMessage } from "react-intl";
import { Alert } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { useOneInch, chainIdToNetwork, networkToChainId } from "@gemunion/provider-1inch";

import { useStyles } from "./styles";

export const Warning: FC = () => {
  const api = useOneInch();
  const web3 = useWeb3React();
  const classes = useStyles();

  const chainId = ~~(web3.chainId || 0);

  if (!chainId || chainId === networkToChainId[api.getNetwork()]) {
    return null;
  }

  return (
    <Alert severity="warning" className={classes.container}>
      <FormattedMessage
        id="pages.1inch.warning.text"
        values={{
          walletNetwork: chainIdToNetwork[chainId] || `#${chainId}`,
          appNetwork: api.getNetwork(),
        }}
      />
    </Alert>
  );
};
