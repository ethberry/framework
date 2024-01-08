import { FC } from "react";
import { IconButton } from "@mui/material";
import { MetaMask } from "@web3-react/metamask";
import { useWeb3React } from "@web3-react/core";

import { MetaMaskIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { IWalletButtonProps } from "./interfaces";
import { useConnectMetamask } from "../../hooks";

export const MetaMaskButton: FC<IWalletButtonProps> = props => {
  const { disabled, onClick, badgeProps = {}, iconButtonProps = {}, iconProps = {}, customIcon } = props;

  const { isActive, connector } = useWeb3React();

  const handleClick = useConnectMetamask({ onClick });

  return (
    <CustomBadge invisible={!isActive || !(connector instanceof MetaMask)} badgeProps={badgeProps}>
      <IconButton disabled={disabled} onClick={handleClick} {...iconButtonProps}>
        {customIcon || <MetaMaskIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} {...iconProps} />}
      </IconButton>
    </CustomBadge>
  );
};
