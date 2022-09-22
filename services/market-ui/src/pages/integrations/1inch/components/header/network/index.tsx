import { createElement, FC, MouseEvent, useEffect, useState } from "react";
import { Box, Button, ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { KeyboardArrowDown } from "@mui/icons-material";
import { FormattedMessage } from "react-intl";

import { useOneInch, Networks, chainIdToNetwork } from "@gemunion/provider-1inch";

import { Arbitrum, Binance, Ethereum, Optimism, Polygon } from "../../icons24";

const components = {
  [Networks.ETHEREUM]: Ethereum,
  [Networks.BINANCE]: Binance,
  [Networks.POLYGON]: Polygon,
  [Networks.OPTIMISM]: Optimism,
  [Networks.ARBITRUM]: Arbitrum,
};

export const NetworkButton: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const api = useOneInch();

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSelect = (network: Networks) => () => {
    api.setNetwork(network);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNetworkChanged = (networkId: string) => {
    const network = chainIdToNetwork[~~networkId];
    if (network) {
      api.setNetwork(network);
    }
  };

  useEffect(() => {
    const { ethereum } = window as any;
    ethereum.on("chainChanged", handleNetworkChanged);

    return () => {
      ethereum.removeListener("chainChanged", handleNetworkChanged);
    };
  });

  return (
    <Box mx={1}>
      <Button
        id="network-button"
        aria-controls="network-menu"
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        variant="contained"
        onClick={handleClick}
        endIcon={<KeyboardArrowDown />}
        startIcon={createElement(components[api.getNetwork()])}
      >
        <FormattedMessage id="pages.1inch.header.network" />
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
        id="network-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {Object.values(Networks).map(key => {
          return (
            <MenuItem key={key} onClick={handleSelect(key)} disableRipple>
              <ListItemIcon>{createElement(components[key])}</ListItemIcon>
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
