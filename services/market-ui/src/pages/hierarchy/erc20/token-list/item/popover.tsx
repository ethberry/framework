import { FC, MouseEvent, useState } from "react";
import { IconButton, Popover } from "@mui/material";
import { Help } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import type { IToken } from "@framework/types";

import { Root, StyledItem, StyledWrapper } from "./styled";

interface ICoinInfoProps {
  token: IToken;
}

export const CoinInfo: FC<ICoinInfoProps> = props => {
  const { token } = props;

  const [anchor, setAnchor] = useState<Element | null>(null);

  const handleOpen = (event: MouseEvent): boolean => {
    event.preventDefault();
    event.stopPropagation();
    setAnchor(event.currentTarget);
    return false;
  };

  const handleClose = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
    setAnchor(null);
  };

  const preventBubbling = (event: MouseEvent): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  const open = Boolean(anchor);
  const id = open ? "info" : undefined;

  return (
    <Root>
      <IconButton
        aria-owns={anchor ? "coin-info" : undefined}
        aria-haspopup="true"
        data-testid="CoinInfo"
        onClick={handleOpen}
        color="inherit"
      >
        <Help />
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchor}
        onClose={handleClose}
        onClick={preventBubbling}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <StyledWrapper>
          <StyledItem>
            <b>
              <FormattedMessage id="pages.erc20.token.contract" />:{" "}
            </b>
            {token.template!.contract?.address}
          </StyledItem>
          <StyledItem>
            <b>
              <FormattedMessage id="pages.erc20.token.decimals" />:{" "}
            </b>
            {token.template!.contract?.decimals}
          </StyledItem>
          <StyledItem>
            <b>
              <FormattedMessage id="pages.erc20.token.symbol" />:{" "}
            </b>
            {token.template!.contract?.symbol}
          </StyledItem>
        </StyledWrapper>
      </Popover>
    </Root>
  );
};
