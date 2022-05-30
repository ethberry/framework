import { FC } from "react";
import { BadgeProps, IconButton, IconButtonProps } from "@mui/material";
import { LedgerConnector } from "@web3-react/ledger-connector";
import { useWeb3React } from "@web3-react/core";

import { LedgerIcon } from "../wallet-icons";
import { CustomBadge } from "../custom-badge";
import { ledgerConnector } from "../../connectors/ledger";

export interface ILedgerButtonButtonProps {
  onClick: () => void;
  disabled?: boolean;
  BadgeProps?: BadgeProps;
  IconButtonProps?: IconButtonProps;
}

// https://github.com/NoahZinsmeister/web3-react/blob/v6/docs/connectors/ledger.md
export const LedgerButton: FC<ILedgerButtonButtonProps> = props => {
  const { disabled, onClick, BadgeProps, IconButtonProps } = props;

  const { activate, connector } = useWeb3React();

  const handleClick = () => {
    void activate(ledgerConnector, console.error);
    onClick();
  };

  return (
    <CustomBadge invisible={!(connector instanceof LedgerConnector)} BadgeProps={BadgeProps}>
      <IconButton disabled={disabled} onClick={handleClick} {...IconButtonProps}>
        <LedgerIcon viewBox="0 0 60 60" sx={{ fontSize: 60 }} />
      </IconButton>
    </CustomBadge>
  );
};
