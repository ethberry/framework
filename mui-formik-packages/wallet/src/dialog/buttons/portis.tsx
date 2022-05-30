import { FC } from "react";
import { BadgeProps, IconButton, IconButtonProps } from "@mui/material";
import { PortisConnector } from "@web3-react/portis-connector";
import { useWeb3React } from "@web3-react/core";

import { PortisIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { portisConnector } from "../../connectors/portis";

export interface IPortisButtonButtonProps {
  onClick: () => void;
  disabled?: boolean;
  BadgeProps?: BadgeProps;
  IconButtonProps?: IconButtonProps;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/portis.md
export const PortisButton: FC<IPortisButtonButtonProps> = props => {
  const { disabled, onClick, BadgeProps, IconButtonProps } = props;

  const { activate, connector } = useWeb3React();

  const handleClick = () => {
    void activate(portisConnector, console.error);
    onClick();
  };

  return (
    <CustomBadge invisible={!(connector instanceof PortisConnector)} BadgeProps={BadgeProps}>
      <IconButton disabled={disabled} onClick={handleClick} {...IconButtonProps}>
        <PortisIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
