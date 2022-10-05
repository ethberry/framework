import { FC } from "react";
import { Link } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { networks } from "@gemunion/provider-wallet";

export interface IScannerLinkProps {
  address: string;
}

export const ScannerLink: FC<IScannerLinkProps> = props => {
  const { address } = props;

  const { chainId = 1 } = useWeb3React();

  return <Link href={`${networks[chainId].blockExplorerUrls[0]}/address/${address}`}>{address}</Link>;
};

export const TxLink: FC<IScannerLinkProps> = props => {
  const { address } = props;

  const { chainId = 1 } = useWeb3React();

  return (
    <Link href={`${networks[chainId].blockExplorerUrls[0]}/tx/${address}`}>{address.substr(0, 8).concat("...")}</Link>
  );
};
