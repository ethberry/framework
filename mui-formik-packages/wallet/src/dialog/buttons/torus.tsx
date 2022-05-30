import { FC } from "react";
import { BadgeProps, IconButton, IconButtonProps } from "@mui/material";
import { TorusConnector } from "@web3-react/torus-connector";
import { useWeb3React } from "@web3-react/core";

import { TorusIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { torusConnector } from "../../connectors/torus";

export interface ITorusButtonButtonProps {
  onClick: () => void;
  disabled?: boolean;
  BadgeProps?: BadgeProps;
  IconButtonProps?: IconButtonProps;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/torus.md
export const TorusButton: FC<ITorusButtonButtonProps> = props => {
  const { disabled, onClick, BadgeProps, IconButtonProps } = props;

  const { activate, connector } = useWeb3React();

  const handleClick = () => {
    void activate(torusConnector, console.error);
    onClick();
  };

  return (
    <CustomBadge invisible={!(connector instanceof TorusConnector)} BadgeProps={BadgeProps}>
      <IconButton disabled={disabled} onClick={handleClick} {...IconButtonProps}>
        <TorusIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
