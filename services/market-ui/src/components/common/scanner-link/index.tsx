import { FC } from "react";
import { Link } from "@mui/material";

import { networks } from "@gemunion/provider-wallet";

export interface IScannerLinkProps {
  address: string;
}

export const ScannerLink: FC<IScannerLinkProps> = props => {
  const { address } = props;

  // TODO get chainId from connection
  return <Link href={`${networks[~~process.env.CHAIN_ID].blockExplorerUrls[0]}/address/${address}`}>{address}</Link>;
};
