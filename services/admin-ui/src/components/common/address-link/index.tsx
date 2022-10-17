import { FC } from "react";
import { Link } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { networks } from "@gemunion/provider-wallet";

export interface IAddressLinkProps {
  address?: string;
}

export const AddressLink: FC<IAddressLinkProps> = props => {
  const { address } = props;

  const { chainId = 1 } = useWeb3React();

  if (!address) {
    return null;
  }

  return <Link href={`${networks[chainId].blockExplorerUrls[0]}/address/${address}`}>{address}</Link>;
};
