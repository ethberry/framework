import { FC } from "react";
import { IconButton } from "@mui/material";
import { useWeb3React } from "@web3-react/core";
import { WalletConnect } from "@web3-react/walletconnect";

import { WalletConnectIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { IWalletButtonProps } from "./interfaces";
import { useConnectWalletConnect } from "../../hooks";

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/walletconnect.md
export const WalletConnectButton: FC<IWalletButtonProps> = props => {
  const { disabled, onClick, badgeProps = {}, iconButtonProps = {}, iconProps = {}, customIcon } = props;

  const { isActive, connector } = useWeb3React();

  const handleClick = useConnectWalletConnect({ onClick });

  return (
    <CustomBadge invisible={!isActive || !(connector instanceof WalletConnect)} badgeProps={badgeProps}>
      <IconButton disabled={disabled} onClick={handleClick} {...iconButtonProps}>
        {customIcon || <WalletConnectIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} {...iconProps} />}
      </IconButton>
    </CustomBadge>
  );
};
