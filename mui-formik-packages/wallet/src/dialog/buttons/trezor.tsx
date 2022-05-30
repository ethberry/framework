import { FC } from "react";
import { BadgeProps, IconButton, IconButtonProps } from "@mui/material";
import { TrezorConnector } from "@web3-react/trezor-connector";
import { useWeb3React } from "@web3-react/core";

import { TrezorIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { trezorConnector } from "../../connectors/trezor";

export interface ITrezorButtonButtonProps {
  disabled?: boolean;
  BadgeProps?: BadgeProps;
  IconButtonProps?: IconButtonProps;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/trezor.md
export const TrezorButton: FC<ITrezorButtonButtonProps> = props => {
  const { disabled, BadgeProps, IconButtonProps } = props;

  const { activate, connector } = useWeb3React();

  const handleClick = () => {
    void activate(trezorConnector, console.error);
  };

  return (
    <CustomBadge invisible={!(connector instanceof TrezorConnector)} BadgeProps={BadgeProps}>
      <IconButton disabled={disabled} onClick={handleClick} {...IconButtonProps}>
        <TrezorIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
