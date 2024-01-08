import { FC } from "react";
import { Link, SxProps, Theme, Tooltip, useMediaQuery } from "@mui/material";
import { useWeb3React } from "@web3-react/core";

import { useAppSelector } from "@gemunion/redux";

export interface IAddressLinkProps {
  address?: string;
  length?: number;
  sx?: SxProps<Theme>;
}

const addressLength = 42;

export const AddressLink: FC<IAddressLinkProps> = props => {
  const { address = "", length = addressLength, sx = [] } = props;

  const { chainId = 1 } = useWeb3React();
  const { networks } = useAppSelector(state => state.wallet);

  if (!address) {
    return null;
  }

  const isSmallScreen = useMediaQuery<Theme>(theme => theme.breakpoints.down("sm"));

  return (
    <Tooltip title={address}>
      <Link target={"_blank"} href={`${networks[chainId].blockExplorerUrls[0]}/address/${address}`} sx={sx}>
        {isSmallScreen
          ? `${address.slice(0, 5)}...${address.slice(-4)}`
          : address.substring(0, length).concat(length < addressLength ? "..." : "")}
      </Link>
    </Tooltip>
  );
};
