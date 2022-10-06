import { FC } from "react";
import { Link } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { networks } from "@gemunion/provider-wallet";

export interface IScannerLinkProps {
  type: string;
  address: string;
}

export const ScannerLink: FC<IScannerLinkProps> = props => {
  const { address, type } = props;

  const { chainId = 1 } = useWeb3React();

  return (
    <Link href={`${networks[chainId].blockExplorerUrls[0]}/${type}/${address}`} target={"_blank"}>
      {address}
    </Link>
  );
};
