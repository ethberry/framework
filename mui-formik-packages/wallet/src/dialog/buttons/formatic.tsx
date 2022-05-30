import { FC } from "react";
import { BadgeProps, IconButton, IconButtonProps } from "@mui/material";
import { FortmaticConnector } from "@web3-react/fortmatic-connector";
import { useWeb3React } from "@web3-react/core";

import { FortmaticIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { fortmaticConnector } from "../../connectors/formatic";

export interface IFortmaticButtonButtonProps {
  onClick: () => void;
  disabled?: boolean;
  BadgeProps?: BadgeProps;
  IconButtonProps?: IconButtonProps;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/fortmatic.md
export const FortmaticButton: FC<IFortmaticButtonButtonProps> = props => {
  const { disabled, onClick, BadgeProps, IconButtonProps } = props;

  const { activate, connector } = useWeb3React();

  const handleClick = () => {
    void activate(fortmaticConnector, console.error);
    onClick();
  };

  return (
    <CustomBadge invisible={!(connector instanceof FortmaticConnector)} BadgeProps={BadgeProps}>
      <IconButton disabled={disabled} onClick={handleClick} {...IconButtonProps}>
        <FortmaticIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
