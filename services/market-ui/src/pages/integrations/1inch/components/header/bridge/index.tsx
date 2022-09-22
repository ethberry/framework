import { createElement, FC, MouseEvent, useState } from "react";
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { AttachMoney, KeyboardArrowDown } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { Arbitrum, Binance, Ethereum, Optimism, Polygon } from "../../icons24";
import { Networks } from "@gemunion/provider-1inch";

const components = {
  [Networks.ETHEREUM]: Ethereum,
  [Networks.BINANCE]: Binance,
  [Networks.POLYGON]: Polygon,
  [Networks.OPTIMISM]: Optimism,
  [Networks.ARBITRUM]: Arbitrum,
};

export const BridgeButton: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box mx={1}>
      <Button
        id="bridge-button"
        aria-controls="bridge-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        startIcon={<AttachMoney />}
      >
        <FormattedMessage id="pages.1inch.header.bridge" />
      </Button>
      <Menu
        elevation={0}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id="bridge-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {Object.values(Networks).map(key => {
          if (key === Networks.ETHEREUM) {
            return null;
          }
          const Icon = createElement(components[key]);
          return (
            <MenuItem key={key} onClick={handleClose} disableRipple>
              <ListItemIcon>{Icon}</ListItemIcon>
              <ListItemText>
                <FormattedMessage id={`pages.1inch.enums.networks.${key as string}`} />
              </ListItemText>
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
};
