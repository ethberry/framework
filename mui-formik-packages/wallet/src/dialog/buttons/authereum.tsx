import { FC } from "react";
import { IconButton, BadgeProps, IconButtonProps } from "@mui/material";
import { AuthereumConnector } from "@web3-react/authereum-connector";
import { useWeb3React } from "@web3-react/core";

import { AuthereumIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { authereumConnector } from "../../connectors/authereum";

export interface IAuthereumButtonButtonProps {
  onClick: () => void;
  disabled?: boolean;
  BadgeProps?: BadgeProps;
  IconButtonProps?: IconButtonProps;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/authereum.md
export const AuthereumButton: FC<IAuthereumButtonButtonProps> = props => {
  const { disabled, onClick, BadgeProps, IconButtonProps } = props;

  const { activate, connector } = useWeb3React();

  const handleClick = () => {
    void activate(authereumConnector, console.error);
    onClick();
  };

  return (
    <CustomBadge invisible={!(connector instanceof AuthereumConnector)} BadgeProps={BadgeProps}>
      <IconButton disabled={disabled} onClick={handleClick} {...IconButtonProps}>
        <AuthereumIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
