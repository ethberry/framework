import { FC } from "react";
import { Link } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { networks } from "@gemunion/provider-wallet";

export interface ITxHashLinkProps {
  hash: string;
}

export const TxHashLink: FC<ITxHashLinkProps> = props => {
  const { hash } = props;

  const { chainId = 1 } = useWeb3React();

  if (!hash) {
    return null;
  }

  return <Link href={`${networks[chainId].blockExplorerUrls[0]}/tx/${hash}`}>{hash.substr(0, 8).concat("...")}</Link>;
};
